import AppError from "../utils/appError";
import { Request, Response, NextFunction, response } from "express";
import mongoose, { Schema } from "mongoose";
import User from "../models/user.model";
import Test from "../models/test.model";
import {
  QuestionStatusEnum,
  SetStatusEnum,
  TestStatusEnum,
} from "../types/enum";
import Question from "../models/questions.model";

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
                verbalScore: "$tests.verbalScore",
                quantitativeScore: "$tests.quantitativeScore",
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
              completedAndInProgressTestIds: {
                $concatArrays: [
                  "$completedTest.testTemplateId",
                  "$inProgressTest.testTemplateId",
                ],
              },
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
                      "$$completedAndInProgressTestIds",
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

  const usertestStatus = await User.aggregate([
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
      $project: {
        _id: 1,
        testId: "$testIds.testId",
        testTemplateId: "$testIds.testTemplateId",
        testIds: 1,
      },
    },
  ]);

  if (usertestStatus.length === 0) throw new AppError("DB error", 500);

  if (usertestStatus[0].testIds) {
    const isTestTemplateIdExist = usertestStatus.some((doc) =>
      doc.testTemplateId.equals(testTemplateId)
    );
    if (isTestTemplateIdExist)
      throw new AppError("Test has already been attempted", 410);
  }

  // Fetch all questions related to the test template
  const questions = await Question.find().lean(); // Modify this if you filter by template ID

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

    const test = await Test.aggregate([
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
              _id: "$questionDetails._id",
              question: "$questionDetails.question",
              positioning: "$questionDetails.positioning",
              options: "$questionDetails.options",
              optionType: "$questionDetails.optionType",
              difficulty: "$questionDetails.difficulty",
              // questionStatus: "$answers.questionStatus",
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

    // // Find the test by ID and populate only the questions, excluding answers
    // const test = await Test.findById(testId)
    //   .populate({
    //     path: "answers.questionId",
    //     select: "question positioning options optionType difficulty userAnswer",
    //   })
    //   .select("answers");
    //   // console.log(test);

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
              // questionStatus: "$answers.questionStatus",
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

    // console.log("test", testA)

    if (!test.length) {
      return next(new AppError("Test not found", 404));
    }

    // console.log("tes", test)

    // // Extract only the populated questions from the answers array
    // const questions = test.answers.map((answer) => answer.questionId);
    // console.log(questions)

    res.status(200).json({
      success: true,
      questionsList: testA[0].questionDetails,
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
    console.log("updateQuestionResponse");
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
          "answers.$.questionStatus": QuestionStatusEnum.ATTEMPTED,
        },
      },
      { new: true }
    );

    // If answer not found, push a new entry
    if (!updatedTest) {
      await Test.findByIdAndUpdate(
        testId,
        {
          $push: {
            answers: {
              questionId,
              userAnswer,
              userAnswerAccuracy,
              isCorrect: checkIfAllEmpty(userAnswer) ? null : isCorrect,
            },
          },
        },
        { new: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "User answer updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const handleMark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Marking Question");
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
    new mongoose.Types.ObjectId(String(testId)),
    {
      $set: {
        testStatus: TestStatusEnum.LOCKED,
        new: true,
      },
    },
    { new: true }
  );

  if (!lockedTest)
    throw new AppError("testId not found/ faile to lock test", 404);

  return res.status(200).json({
    success: true,
    message: "Test locked successfully",
  });
};

export {
  userTestInfo,
  handleCreateTest,
  handleGetTestQuestions,
  updateQuestionResponse,
  lockTest,
  handleMark,
};
