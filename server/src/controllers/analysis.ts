import { Request, Response, NextFunction } from "express";
import Test from "../models/test.model";
import mongoose from "mongoose";
import AppError from "../utils/appError";

// Define interfaces for better type checking
interface Answer {
  questionId: mongoose.Types.ObjectId;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean | null;
  timeTaken: number;
  markedForReview?: boolean;
}

interface TopicAnalysis {
  topicId: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  notAttempted: number;
  accuracy: string;
  totalTimeSpent: number;
}

interface ReviewQuestion {
  questionId: mongoose.Types.ObjectId;
  question: string;
  options: any[];
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean | null;
  timeTaken: number;
  markedForReview: boolean;
}

export const getTestAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { testId } = req.query;
    
    if (!testId) {
      return next(new AppError("Test Id is required", 400));
    }

    const objectId = new mongoose.Types.ObjectId(testId as string);

    // First aggregation to get test with its basic analytics
    const testData = await Test.aggregate([
      { $match: { _id: objectId } },
      // Lookup test template for question IDs in one operation
      {
        $lookup: {
          from: "testtemplates",
          localField: "testTemplateId",
          foreignField: "_id",
          as: "template"
        }
      },
      { $unwind: "$template" },
      // Lookup questions based on template's question IDs
      {
        $lookup: {
          from: "questions",
          localField: "template.questionIds",
          foreignField: "_id",
          as: "questions"
        }
      },
      // Calculate analytics metrics
      {
        $set: {
          attemptedCount: {
            $size: {
              $filter: {
                input: "$answers",
                as: "ans",
                cond: { $ne: ["$$ans.isCorrect", null] }
              }
            }
          },
          correctCount: {
            $size: {
              $filter: {
                input: "$answers",
                as: "ans",
                cond: { $eq: ["$$ans.isCorrect", true] }
              }
            }
          },
          incorrectCount: {
            $size: {
              $filter: {
                input: "$answers",
                as: "ans",
                cond: { $eq: ["$$ans.isCorrect", false] }
              }
            }
          }
        }
      },
      // Calculate scores
      {
        $set: {
          correctAnswerScore: { $multiply: ["$correctCount", 2] },
          negativeMarks: { $multiply: ["$incorrectCount", 0.06] }
        }
      },
      // Project final output
      {
        $project: {
          _id: 1,
          testTimeSpent: 1,
          totalQuestions: { $size: "$answers" },
          attemptedCount: 1,
          correctCount: 1,
          incorrectCount: 1,
          correctAnswerScore: 1,
          negativeMarks: 1,
          answers: 1,
          testTemplateId: 1,
          questions: 1
        }
      }
    ]);

    if (!testData.length) {
      return res.status(404).json({ message: "Test not found" });
    }

    const test = testData[0];
    const questions = test.questions;

    // Create a question map for faster lookups
    const questionMap = new Map<string, any>(
      questions.map((q: any) => [q._id.toString(), q])
    );

    // Process topic-wise analysis
    const topicAnalysis: Record<string, TopicAnalysis> = {};

    test.answers.forEach((answer: Answer) => {
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
          totalTimeSpent: 0
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

    // Compute accuracy percentage
    Object.values(topicAnalysis).forEach(topic => {
      topic.accuracy =
        topic.totalQuestions > 0
          ? ((topic.correct / topic.totalQuestions) * 100).toFixed(2)
          : "0.00";
    });

    // Map review test data
    const reviewTest: ReviewQuestion[] = test.answers.map((answer: Answer) => {
      const question = questionMap.get(answer.questionId.toString());
      return {
        questionId: answer.questionId,
        question: question?.question || "Unknown",
        options: question?.options || [],
        userAnswer: answer.userAnswer,
        correctAnswer: answer.correctAnswer,
        isCorrect: answer.isCorrect,
        timeTaken: answer.timeTaken || 0,
        markedForReview: answer.markedForReview || false
      };
    });

    // Return analytics data
    return res.json({
      totalQuestions: test.totalQuestions,
      attemptedCount: test.attemptedCount,
      correctCount: test.correctCount,
      incorrectCount: test.incorrectCount,
      correctAnswerScore: test.correctAnswerScore,
      negativeMarks: test.negativeMarks,
      testTimeSpent: test.testTimeSpent,
      topicWiseAnalysis: Object.values(topicAnalysis),
      reviewTest
    });
  } catch (error) {
    console.error("Error fetching test analytics:", error);
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};