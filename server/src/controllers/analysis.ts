import { Request, Response, NextFunction } from "express";
import Test from "../models/test.model";
import TestTemplate from "../models/testTemplate.model";
import mongoose from "mongoose";
import AppError from "../utils/appError";
import Question from "../models/questions.model";
import { QuestionStatusEnum } from "../types/enum";



interface TopicAnalysis {
  topicId: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  notAttempted: number;
  accuracy: string;
  totalTimeSpent: number;
}


export const getTestAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { testId } = req.query;

    if (!testId) {
      return next(new AppError("Test Id is required", 400));
    }

    const objectId = new mongoose.Types.ObjectId(testId as string);

    
    const test = await Test.findById(objectId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    
    const testTemplate = await TestTemplate.findById(test.testTemplateId);
    if (!testTemplate) {
      return res.status(404).json({ message: "Test template not found" });
    }

    
    const questions = await Question.find({ _id: { $in: testTemplate.questionIds } });

    
    const questionMap = new Map<string, any>(
      questions.map((q: any) => [q._id.toString(), q])
    );

    
    const topicAnalysis: Record<string, TopicAnalysis> = {};

    test.answers.forEach((answer: any) => {
      const question = questionMap.get(answer.questionId.toString());
      if (!question) return;


      const topicId = question.topic.toString();

      if (!topicAnalysis[topicId]) {
        topicAnalysis[topicId] = {
          topicId,
          totalQuestions: 0,
          correct: 0,
          incorrect: 0,
          notAttempted: 0,
          accuracy: "0.00",
          totalTimeSpent: 0,
        };
      }

      topicAnalysis[topicId].totalQuestions += 1;
      topicAnalysis[topicId].totalTimeSpent += answer.timeTaken || 0;

      if (answer.isCorrect === true) {
        topicAnalysis[topicId].correct += 1;
      } else if (answer.isCorrect === false) {
        topicAnalysis[topicId].incorrect += 1;
      } else {
        topicAnalysis[topicId].notAttempted += 1;
      }
    });

    
    Object.values(topicAnalysis).forEach((topic) => {
      topic.accuracy =
        topic.totalQuestions > 0
          ? ((topic.correct / topic.totalQuestions) * 100).toFixed(2)
          : "0.00";
    });

    
    const reviewTest = test.answers.map((answer) => {
      const question = questionMap.get(answer.questionId.toString());
      return {
        questionId: answer.questionId,
        question: question?.question || "Unknown",
        options: question?.options || [],
        userAnswer: answer.userAnswer,
        correctAnswer: answer.correctAnswer,
        isCorrect: answer.isCorrect,
        timeTaken: answer.timeTaken || 0,
        markedForReview: answer.questionStatus===QuestionStatusEnum.MARKED || false,
        questionStatus: answer.questionStatus || null
      };
    });

    
    return res.json({
      totalQuestions: test.answers.length,
      attemptedCount: test.answers.filter((ans) => ans.isCorrect !== null).length,
      correctCount: test.answers.filter((ans) => ans.isCorrect === true).length,
      incorrectCount: test.answers.filter((ans) => ans.isCorrect === false).length,
      correctAnswerScore: test.answers.filter((ans) => ans.isCorrect === true).length * 2,
      negativeMarks: test.answers.filter((ans) => ans.isCorrect === false).length * 0.66,
      testTimeSpent: test.testTimeSpent,
      topicWiseAnalysis: Object.values(topicAnalysis),
      reviewTest,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};


export const getTestReviewQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { testId } = req.query;
    if (!testId) {
      return next(new AppError("Test ID is required", 400));
    }

    console.log("Received testId:", testId)
    const testA = await Test.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(String(testId)),
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