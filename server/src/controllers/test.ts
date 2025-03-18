import AppError from "../utils/appError";
import { Request, Response, NextFunction, response } from "express";
import mongoose, { Schema } from "mongoose";
import User from "../models/user.model";
import Test from "../models/test.model";
import { QuestionStatusEnum, TestStatusEnum } from "../types/enum";
import Question from "../models/questions.model";
import TestTemplate from "../models/testTemplate.model";
import { lockAndUpdateTestScore } from "../dbFunctions/Test";

export function calulateAccuracyOfUserAnswer(
  userAnswer: string[][],
  correctAnswer: string[][]
): Number {
  if (userAnswer.length !== correctAnswer.length) return 0;

  const calculateSublistAccuracy = (
    correct: string[],
    user: string[]
  ): number => {
    const correctSet = new Set(correct);
    const userSet = new Set(user);

    //  handling multiSelect case specialy
    const extraElements = [...userSet].filter((item) => !correctSet.has(item));

    // intersection
    const commonElements = [...correctSet].filter((item) => userSet.has(item));

    // Calculate accuracy
    const accuracy =
      (commonElements.length / (correctSet.size + extraElements.length)) * 100;
    return accuracy;
  };

  let accuracies: number[] = [];

  for (let i = 0; i < correctAnswer.length; i++) {
    const correct = correctAnswer[i];
    const userCorrect = userAnswer[i];

    const accuracy = calculateSublistAccuracy(correct, userCorrect);
    accuracies.push(accuracy);
  }
  const averageAccuracy =
    accuracies.reduce((sum, accuracy) => sum + accuracy, 0) / accuracies.length;
  return averageAccuracy;
}

export function calculateNumericalAccuracy(
  userAnswer: string[][],
  correctAnswer: string[][]
): number {
  let precisionPercentage: number = 5;
  const correctValue = Number(correctAnswer[0][0]);
  const userResponse = Number(userAnswer[0][0]);

  if (isNaN(correctValue) || isNaN(userResponse)) {
    return 0;
  }

  const maxRange = correctValue + (correctValue * precisionPercentage) / 100;
  const minRange = correctValue - (correctValue * precisionPercentage) / 100;

  // user answer within the valid range
  const isInRange = userResponse >= minRange && userResponse <= maxRange;

  if (isInRange) {
    const difference = Math.abs(userResponse - correctValue);
    return 100 - (difference / correctValue) * 100;
  } else {
    return 0; // If the answer is out of the range, return 0 accuracy
  }
}

export function checkIfAllEmpty(userAnswer: any[][]): boolean {
  // Check if all subarrays are empty
  return userAnswer.every((subArray) => subArray.length === 0);
}

async function checkSectionTestTimeLimit(
  userId: string,
  testId: mongoose.Types.ObjectId
) {
  const test = await Test.findById(testId).select(
    "testTimeLimit testTimeSpent testStatus"
  );
  if (test) {
    if (test.testTimeSpent > test.testTimeLimit) {
      const lockAndUpdateSectionalTestStatus = lockAndUpdateTestScore(
        userId,
        testId
      );
      return true;
    }
  }
  return false;
}

const userTestInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let userId: string | null = req.user?.id;

  if (!userId) {
    return next(new AppError("User ID is required", 400));
  }

  const user = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $unwind: {
        path: "$testIds",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "tests",
        localField: "testIds.testId",
        foreignField: "_id",
        as: "tests",
      },
    },
    {
      $lookup: {
        from: "testtemplates",
        localField: "testIds.testTemplateId",
        foreignField: "_id",
        as: "testTemplates",
      },
    },
    {
      $unwind: {
        path: "$tests",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "testtemplates",
        pipeline: [
          {
            $project: {
              _id: 1,
              testTemplateId: "$_id",
              testName: 1,
              active: 1,
              isDeleted: 1,
            },
          },
          {
            $match: { active: true, isDeleted: false },
          },
        ],
        as: "allTestTemplates",
      },
    },
    {
      $group: {
        _id: "$_id",
        userName: { $first: { $concat: ["$firstName", " ", "$lastName"] } },
        email: { $first: "$email" },
        completedTest: {
          $push: {
            $cond: {
              if: { $eq: ["$tests.testStatus", "LOCKED"] },
              then: {
                testId: "$tests._id",
                testTemplateId: "$testIds.testTemplateId",
                testName: { $arrayElemAt: ["$testTemplates.testName", 0] },
                completeDate: "$tests.updatedAt",
                totalScore: "$tests.totalScore",
                testTimeSpent: "$tests.testTimeSpent",
              },
              else: null,
            },
          },
        },
        inProgressTest: {
          $push: {
            $cond: {
              if: {
                $in: ["$tests.testStatus", ["IN_PROGRESS", "NOT_STARTED"]],
              },
              then: {
                testId: "$tests._id",
                testTemplateId: "$testIds.testTemplateId",
                testName: { $arrayElemAt: ["$testTemplates.testName", 0] },
                startDate: "$tests.createdAt",
                testTimeSpent: "$tests.testTimeSpent",
                testCompletionPercent: "$tests.testCompletionPercent",
              },
              else: null,
            },
          },
        },
        allTestTemplates: { $addToSet: "$allTestTemplates" },
      },
    },
    {
      $project: {
        _id: 1,
        userName: 1,
        email: 1,
        completedTest: {
          $filter: {
            input: "$completedTest",
            as: "test",
            cond: { $ne: ["$$test", null] },
          },
        },
        inProgressTest: {
          $filter: {
            input: "$inProgressTest",
            as: "test",
            cond: { $ne: ["$$test", null] },
          },
        },
        unAttemptedTest: {
          $let: {
            vars: {
              allTestTemplateIdsFlattened: {
                $reduce: {
                  input: "$allTestTemplates",
                  initialValue: [],
                  in: { $concatArrays: ["$$value", "$$this"] },
                },
              },
              inProgressTestIds: "$inProgressTest.testTemplateId",
            },
            in: {
              $let: {
                vars: {
                  remainingTestTemplateIds: {
                    $setDifference: [
                      {
                        $map: {
                          input: "$$allTestTemplateIdsFlattened",
                          as: "testTemplate",
                          in: "$$testTemplate._id",
                        },
                      },
                      "$$inProgressTestIds",
                    ],
                  },
                },
                in: {
                  $filter: {
                    input: "$$allTestTemplateIdsFlattened",
                    as: "testTemplate",
                    cond: {
                      $in: ["$$testTemplate._id", "$$remainingTestTemplateIds"],
                    },
                  },
                },
              },
            },
          },
        },
        completedAndInProgressTestIds: {
          $concatArrays: [
            "$completedTest.testTemplateId",
            "$inProgressTest.testTemplateId",
          ],
        },
      },
    },
  ]);

  // Check if user data is retrieved
  if (user.length === 0) {
    return next(new AppError("User not found", 404));
  }

  // Ensure tests arrays exist even if empty
  const result = {
    _id: user[0]._id,
    userName: user[0].userName,
    email: user[0].email,
    completedTest: user[0].completedTest || [],
    inProgressTest: user[0].inProgressTest || [],
    unAttemptedTest: user[0].unAttemptedTest || [],
  };

  return res.status(200).json({
    success: true,
    user: result,
  });
};

const handleCreateTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { testTemplateId } = req.body;
  let userId: string = req.user?.id;

  if (!testTemplateId) throw new AppError("Field not found", 400);

  // const usertestStatus = await User.aggregate([
  //   {
  //     $match: { _id: new mongoose.Types.ObjectId(userId) },
  //   },
  //   {
  //     $unwind: {
  //       path: "$testIds",
  //       preserveNullAndEmptyArrays: true,
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       testId: "$testIds.testId",
  //       testTemplateId: "$testIds.testTemplateId",
  //       testIds: 1,
  //     },
  //   },
  // ]);

  // if (usertestStatus.length === 0) throw new AppError("DB error", 500);

  // if (usertestStatus[0].testIds) {
  //   const isTestTemplateIdExist = usertestStatus.some((doc) =>
  //     doc.testTemplateId.equals(testTemplateId)
  //   );
  //   if (isTestTemplateIdExist)
  //     throw new AppError("Test has already been attempted", 410);
  // }

  interface IQuestion {
    _id: string;
    correctAnswer: string[][];
  }

  const testTemplate = await TestTemplate.findById(testTemplateId).populate<{
    questionIds: IQuestion[];
  }>("questionIds");

  if (!testTemplate) {
    throw new AppError("Invalid testTemplateId", 404);
  }

  const questions: IQuestion[] = testTemplate.questionIds as IQuestion[];

  // Fetch all questions related to the test template
  // const questions = await Question.find().lean(); // Modify this if you filter by template ID

  if (!questions.length) {
    throw new AppError("No questions found for this test", 404);
  }

  // Prepare the answers array with correct answers pre-filled
  const answers = questions.map((question) => ({
    questionId: question._id,
    questionStatus: "UNSEEN", // Default status
    correctAnswer: question.correctAnswer, // Pre-fill correct answer
    userAnswer: [], // Empty initially
    isCorrect: null, // Not attempted yet
    userAnswerAccuracy: null,
    questionStartTime: null,
    questionEndTime: null,
    timeTaken: 0,
  }));

  const newTest = new Test({
    testTemplateId: new mongoose.Types.ObjectId(String(testTemplateId)),
    answers, // Attach pre-filled answers
  });

  await newTest.save();

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: { activeTest: newTest._id },
      $addToSet: {
        testIds: {
          testId: newTest._id,
          testTemplateId: testTemplateId,
        },
      },
    },
    { new: true, upsert: true }
  );

  if (!updatedUser) {
    return next(new AppError("Failed to update user with new test", 500));
  }

  return res.status(200).json({
    success: true,
    message: "Test created successfully with answers pre-filled",
    testId: newTest._id,
  });
};

// async function checkSetTimeLimit(
//   userId: string,
//   activeTestId: Schema.Types.ObjectId,
//   setName: string,
// ) {
//   const test = await Test.findById(activeTestId).select("sets testStatus");
//   if (test) {
//     const setInfo = test.sets.find((set) => set.setName === setName);
//     if (setInfo) {
//       if (setInfo.timeSpent > setInfo.timeLimit) {
//         // locking the set
//         setInfo.setStatus = SetStatusEnum.LOCKED;
//         await test.save();

//         // on locking creating nextSet
//         let nextSetName: string = "";
//         let nextSetCreated;

//         if (setName === "VERBAL") {
//           nextSetName = "QUANTITATIVE";
//           nextSetCreated = await createSetForTest(userId, nextSetName);
//         } else if (setName === "QUANTITATIVE") {
//           nextSetName = "VERBAL_2";
//           nextSetCreated = await createSetBasedOnPreviousSet(
//             userId,
//             nextSetName
//           );
//         } else if (setName === "VERBAL_2") {
//           nextSetName = "QUANTITATIVE_2";
//           nextSetCreated = await createSetBasedOnPreviousSet(
//             userId,
//             nextSetName
//           );
//         } else if (setName === "QUANTITATIVE_2") {

//           const lockAndUpdateTestScoreStatus = await lockAndUpdateTestScore(
//             userId,
//             activeTestId.toString()
//           );
//           nextSetCreated = 1;

//           // test.testStatus = TestStatusEnum.LOCKED;
//           // await test.save();

//           // const user = await User.findById(userId).select("activeTest");
//           // if (user) {
//           //   user.activeTest = null;
//           //   await user.save();
//           // }

//           // nextSetName = "ANALYTICS";
//           // nextSetCreated = await createSetForTest(userId, nextSetName);
//         }
//         if (!nextSetCreated) {
//           throw new AppError("set Not created", 404);
//         }
//         return true;
//       }
//     }
//   }
//   return false;
// }
// async function checkTestTimeLimit(
//   userId: string,
//   activeTestId: Schema.Types.ObjectId
// ) {
//   const test = await Test.findById(activeTestId).select(
//     "testTimeLimit testTimeSpent testStatus"
//   );
//   if (test) {
//     if (test.testTimeSpent > test.testTimeLimit) {
//       // test.testStatus = TestStatusEnum.LOCKED;
//       // const lockedTest = await test.save();
//       // if (lockedTest || test.testStatus == TestStatusEnum.LOCKED) {
//       //   const user = await User.findById(userId).select("activeTest");
//       //   if (user) {
//       //     user.activeTest = null;
//       //     await user.save();
//       //   }
//       // }
//       const lockAndUpdateTestScoreStatus = await lockAndUpdateTestScore(
//         userId,
//         activeTestId.toString()
//       );
//       return true;
//     }
//   }
//   return false;
// }

const handleGetTestQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { testId } = req.query;
    if (!testId) {
      return next(new AppError("Test ID is required", 400));
    }

    console.log("Received testId:", testId);

    // const test = await Test.aggregate([
    //   {
    //     $match: {
    //       _id: new mongoose.Types.ObjectId(String(testId)),
    //       testStatus: { $ne: "LOCKED" },
    //     },
    //   },
    //   {
    //     $unwind: "$answers",
    //   },
    //   {
    //     $lookup: {
    //       from: "questions",
    //       let: { questionId: "$answers.questionId" },
    //       pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$questionId"] } } }],
    //       as: "questionDetails",
    //     },
    //   },
    //   {
    //     $unwind: { path: "$questionDetails", preserveNullAndEmptyArrays: true },
    //   },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       timeLimit: { $first: "$testTimeLimit" },
    //       timeSpent: { $first: "$testTimeSpent" },
    //       questionDetails: {
    //         $push: {
    //           _id: "$questionDetails._id",
    //           question: "$questionDetails.question",
    //           positioning: "$questionDetails.positioning",
    //           options: "$questionDetails.options",
    //           optionType: "$questionDetails.optionType",
    //           difficulty: "$questionDetails.difficulty",
    //           // questionStatus: "$answers.questionStatus",
    //           userAnswer: "$answers.userAnswer",
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       timeLimit: 1,
    //       timeSpent: 1,
    //       timeRemaining: { $subtract: ["$timeLimit", "$timeSpent"] },
    //       questionDetails: { $ifNull: ["$questionDetails", []] },
    //     },
    //   },
    // ]);

    const testA = await Test.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(String(testId)),
          testStatus: { $ne: "LOCKED" },
        },
      },
      {
        $unwind: "$answers",
      },
      {
        $lookup: {
          from: "questions",
          let: { questionId: "$answers.questionId" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$questionId"] } } }],
          as: "questionDetails",
        },
      },
      {
        $unwind: { path: "$questionDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$_id",
          timeLimit: { $first: "$testTimeLimit" },
          timeSpent: { $first: "$testTimeSpent" },
          questionDetails: {
            $push: {
              questionId: "$questionDetails._id",
              question: "$questionDetails.question",
              positioning: "$questionDetails.positioning",
              options: "$questionDetails.options",
              optionType: "$questionDetails.optionType",
              difficulty: "$questionDetails.difficulty",
              questionStatus: "$answers.questionStatus",
              userAnswer: "$answers.userAnswer",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          timeLimit: 1,
          timeSpent: 1,
          timeRemaining: { $subtract: ["$timeLimit", "$timeSpent"] },
          questionDetails: { $ifNull: ["$questionDetails", []] },
        },
      },
    ]);

    if (!testA.length) {
      return next(new AppError("Test not found", 404));
    }

    res.status(200).json({
      success: true,
      questionsList: testA[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateQuestionResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("updatequestion");
    const { questionId, userAnswer, testId } = req.body;
    const userId: string = req.user?.id;

    if (!userId) return next(new AppError("User not authenticated", 401));

    if (!testId) {
      return next(new AppError("Test ID is required", 400));
    }

    // Get the test details
    const test = await Test.findById(testId);
    if (!test) {
      return next(new AppError("Test not found", 404));
    }

    // Get the question details
    const question = await Question.findById(questionId).select(
      "correctAnswer optionType"
    );
    if (!question) {
      return next(new AppError("Question not found", 404));
    }
    const correctAnswer = question.correctAnswer;
    const isCorrect =
      JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);

    // Calculate accuracy based on question type
    let userAnswerAccuracy: Number | null = null;
    if (
      question.optionType === "numerical" ||
      question.optionType === "fractional"
    ) {
      userAnswerAccuracy = calculateNumericalAccuracy(
        userAnswer,
        correctAnswer
      );
    } else {
      userAnswerAccuracy = calulateAccuracyOfUserAnswer(
        userAnswer,
        correctAnswer
      );
    }

    // Update existing answer or push a new one if not found
    const updatedTest = await Test.findOneAndUpdate(
      {
        _id: testId,
        "answers.questionId": questionId,
      },
      {
        $set: {
          "answers.$.userAnswer": userAnswer,
          "answers.$.userAnswerAccuracy": userAnswerAccuracy,
          "answers.$.isCorrect": checkIfAllEmpty(userAnswer) ? null : isCorrect,
          "answers.$.questionStatus": checkIfAllEmpty(userAnswer)
            ? QuestionStatusEnum.SEEN
            : QuestionStatusEnum.ATTEMPTED,
        },
      },
      { new: true }
    );
    const updatedAnswer = updatedTest?.answers.find(
      (item) => item.questionId.toString() === questionId
    );
    // const updatedAnswer = updatedTest?.answers[0];

    return res.status(200).json({
      success: true,
      message: "User answer updated successfully",
      updatedAnswer,
    });
  } catch (error) {
    next(error);
  }
};

const handleMark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questionId, testId } = req.body;
    const userId: string = req.user?.id;

    if (!userId) return next(new AppError("User not authenticated", 400));
    if (!testId) return next(new AppError("Test ID is required", 400));
    if (!questionId) return next(new AppError("Question ID is required", 400));

    // Check if the test exists
    const test = await Test.findById(testId);
    if (!test) return next(new AppError("Test not found", 404));

    // Update the question status to "MARKED"
    const updatedTest = await Test.findOneAndUpdate(
      {
        _id: testId,
        "answers.questionId": questionId,
      },
      {
        $set: { "answers.$.questionStatus": QuestionStatusEnum.MARKED },
      },
      { new: true }
    );

    if (!updatedTest) {
      return next(new AppError("Question answer entry not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Question marked successfully",
    });
  } catch (error) {
    next(error);
  }
};

const lockTest = async (req: Request, res: Response, next: NextFunction) => {
  const { testId } = req.body;
  if (!testId) throw new AppError("TestId not found", 400);

  const lockedTest = await Test.findByIdAndUpdate(
    testId,
    [
      {
        $set: {
          testStatus: TestStatusEnum.LOCKED,
          totalScore: {
            $sum: {
              $map: {
                input: "$answers",
                as: "answer",
                in: {
                  $cond: {
                    if: { $eq: ["$$answer.isCorrect", true] },
                    then: 2,
                    else: {
                      $cond: {
                        if: { $eq: ["$$answer.isCorrect", false] },
                        then: -0.6,
                        else: 0,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
    { new: true }
  );

  if (!lockedTest)
    throw new AppError("testId not found/ faile to lock test", 404);

  return res.status(200).json({
    success: true,
    message: "Test locked successfully",
  });
};

const startQuestionTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { testId, questionId } = req.body;
    console.log("startQuestionTime", testId, questionId);
    const userId: string = req.user?.id;

    if (!testId) {
      throw new AppError("Test not Found", 400);
    }
    if (!questionId) {
      throw new AppError("Question not Found", 400);
    }
    if (!userId) {
      throw new AppError("User not Authenticated", 400);
    }

    // Find the test and check if the question exists
    const test = await Test.findOne(
      { _id: testId, "answers.questionId": questionId },
      { "answers.$": 1 } // Fetch only the specific question entry
    );

    if (!test || !test.answers.length) {
      return next(new AppError("Question answer entry not found", 404));
    }
    const questionAnswer = test.answers[0];

    // updating question time by seting new Date()
    let updateFields: any = {
      "answers.$[answer].questionStartTime": new Date(),
    };

    if (questionAnswer.questionStatus === QuestionStatusEnum.UNSEEN) {
      updateFields["answers.$[answer].questionStatus"] =
        QuestionStatusEnum.SEEN;
    }

    const updatedQuestion = await Test.findByIdAndUpdate(
      new mongoose.Types.ObjectId(String(testId)),
      {
        $set: updateFields,
      },
      {
        new: true,
        arrayFilters: [
          {
            "answer.questionId": new mongoose.Types.ObjectId(
              String(questionId)
            ),
          },
        ],
      }
    );

    return res.status(200).json({
      message: "Question start time recorded successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    next(error);
  }
};

const endQuestionTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { testId, questionId } = req.body;
    const userId: string = req.user?.id;

    if (!testId) {
      throw new AppError("Test not Found", 400);
    }
    if (!questionId) {
      throw new AppError("Question not Found", 400);
    }
    if (!userId) {
      throw new AppError("User not Authenticated", 400);
    }

    // Find the test and check if the question exists
    const test = await Test.findOne(
      { _id: testId, "answers.questionId": questionId },
      { "answers.$": 1 } // Fetch only the specific question entry
    );

    if (!test || !test.answers.length) {
      return next(new AppError("Question answer entry not found", 404));
    }

    const questionAnswer = test.answers[0];

    const { questionStartTime, timeTaken } = questionAnswer ?? {
      questionStartTime: null,
      timeTaken: 0,
    };
    let questionTimeTaken = Number(timeTaken);

    if (questionStartTime) {
      questionTimeTaken += Math.floor(
        (new Date().getTime() - questionStartTime.getTime()) / 1000
      );
    }

    const updatedQuestion = await Test.findByIdAndUpdate(
      new mongoose.Types.ObjectId(String(testId)),
      {
        $set: {
          "answers.$[answer].timeTaken": questionTimeTaken,
          "answers.$[answer].questionStartTime": null,
        },
      },
      {
        new: true,
        arrayFilters: [
          {
            "answer.questionId": new mongoose.Types.ObjectId(
              String(questionId)
            ),
          },
        ],
      }
    );

    if (!updatedQuestion) throw new AppError("Time not paused", 403);

    return res.status(200).json({
      message: "Question time recorded successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    next(error);
  }
};

const startTestTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { testId } = req.body;
  const userId: string = req.user?.id;

  const testStatus = await checkSectionTestTimeLimit(
    userId,
    new mongoose.Types.ObjectId(String(testId))
  );
  if (testStatus) throw new AppError("Test time is over", 423);

  const updatedTestStartTime = await Test.findByIdAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(String(testId)),
    },
    {
      $set: {
        testStartTime: new Date(),
      },
    },
    { new: true }
  );

  if (!updatedTestStartTime) throw new AppError("Time not updated", 403);

  return res.status(200).json({
    success: true,
    message: "Test timer started",
    updatedTestStartTime,
  });
};

const endTestTime = async (req: Request, res: Response, next: NextFunction) => {
  const { testId } = req.body;
  const userId: string = req.user?.id;

  const test = await Test.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(String(testId)) },
    },
    {
      $project: {
        _id: 0,
        testTimeLimit: 1,
        startTime: "$testStartTime",
        timeSpent: "$testTimeSpent",
        answers: "$answers",
      },
    },
  ]);

  const { testTimeLimit, startTime, timeSpent, answers } = test
    ? test[0]
    : null;
  let testTimeSpent: number;
  if (startTime) {
    testTimeSpent =
      timeSpent +
      Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
  } else testTimeSpent = timeSpent;

  const updatedTestTimeSpent = await Test.findByIdAndUpdate(
    new mongoose.Types.ObjectId(String(testId)),
    {
      $set: {
        testTimeSpent: testTimeSpent,
        testStartTime: null,
      },
    },
    { new: true }
  );

  if (!updatedTestTimeSpent) throw new AppError("Time not updated", 403);

  const testStatus = await checkSectionTestTimeLimit(
    userId,
    new mongoose.Types.ObjectId(String(testId))
  );
  if (testStatus) throw new AppError("Test time is over", 423);

  return res.status(200).json({
    success: true,
    message: "Test timer paused",
    testId: updatedTestTimeSpent,
  });
};

export {
  userTestInfo,
  handleCreateTest,
  handleGetTestQuestions,
  updateQuestionResponse,
  lockTest,
  handleMark,
  startQuestionTime,
  endQuestionTime,
  startTestTime,
  endTestTime,
};
