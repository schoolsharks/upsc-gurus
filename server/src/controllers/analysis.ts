import AppError from "../utils/appError";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Test from "../models/test.model";

const testScore = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { testId } = req.query;

    if (!testId)
        throw new AppError("TestId not found", 400);

    const getCorrectAnswersCount = await Test.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(String(testId)) }
        },
        {
            $unwind: "$answers"
        },
        {
            $group: {
                _id: {
                    testId: "$_id",
                    timeSpent: "$testTimeSpent",
                },
                trueCount: {
                    $sum: {
                        $cond: [{ $eq: ['$answers.isCorrect', true] }, 1, 0]
                    }
                },
                falseCount: {
                    $sum: {
                        $cond: [{ $eq: ['$answers.isCorrect', false] }, 1, 0]
                    }
                },
                nullCount: {
                    $sum: {
                        $cond: [{ $eq: ['$answers.isCorrect', null] }, 1, 0]
                    }
                },
                questions: {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                _id: 0,
                testId: "$_id.testId",
                timeSpent: "$_id.timeSpent",
                trueCount: 1,
                falseCount: 1,
                nullCount: 1,
                questions: 1
            }
        }
    ]);

    if (!getCorrectAnswersCount.length)
        throw new AppError("testId not found", 404);

    const { trueCount, falseCount, nullCount, questions } = getCorrectAnswersCount[0];

    const scoreAchieved = (trueCount * 2) - (0.66 * falseCount)

    return res.status(200).json({
        success: true,
        maxScore: questions,
        scoreAchieved,
        inCorrect: falseCount,
        correct: trueCount,
        notAttempted: nullCount,
    })
}

export {testScore}