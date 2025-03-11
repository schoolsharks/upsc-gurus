import mongoose, { ObjectId } from "mongoose";
import Test from "../models/test.model";
import User from "../models/user.model";
import { evaluateAndUpdateTestScore } from "./Calculation";

interface Answer {
    questionId: string;
    questionStatus: string;
};

interface Set {
    setName: string;
    setStatus: string;
    setSetStartTime: Date;
    setTimeSpent: number;
    answers: Answer[];
};

interface Test {
    _id: string;
    testStatus: string;
    testTimeSpent: number;
    sets: Set[];
};

function evaluateSetCompletion(set: Set): number {
    // if set is locked thus means set completion is 100%
    if(set.setStatus === "LOCKED")
        return 1;

    const totalQuestions = set.answers.length;
    let seenedQuestions = 0;

    // Count questionStatus != 'UNSEEN'
    set.answers.forEach((answer: Answer) => {
        if (answer.questionStatus !== 'UNSEEN') {
            seenedQuestions++;
        }
    });

    // percentage of senned questions
    const answerCompletionPercentage = (seenedQuestions / totalQuestions) * 100;

    // completion percentage for this set in fraction
    return answerCompletionPercentage / 100;
}

function evaluateTestCompletion(test: Test): number {
    // if test is locked thus means test is 100% completed
    if(test.testStatus === 'LOCKED')
        return 100;

    const numberOfSets = 4;
    const setCompletionPercentage = 100 / numberOfSets;

    let totalCompletionPercentage = 0;

    // iterating to each sets
    test.sets.forEach((set: Set) => {
        const setCompletion = evaluateSetCompletion(set);
        totalCompletionPercentage += setCompletionPercentage * setCompletion;
    });
    return totalCompletionPercentage;
}

function evaluateSetTimeSpent(test: Test, setName: string) {
    let timeSpent: number;         // time spent on set 
    let newtestTimeSpent: number;

    const { testTimeSpent } = test;
    const set = test.sets.find((set) => set.setName === setName)
    if (!set)
        return { newtestTimeSpent: testTimeSpent, timeSpent: 234 };

    const { setSetStartTime, setTimeSpent } = set;

    if (setSetStartTime) {
        timeSpent = setTimeSpent + Math.floor((new Date().getTime() - setSetStartTime.getTime()) / 1000);
        newtestTimeSpent = testTimeSpent + (timeSpent - setTimeSpent);
    }
    else {
        timeSpent = setTimeSpent;
        newtestTimeSpent = testTimeSpent;
    }

    return { testTimeSpent:newtestTimeSpent, setTimeSpent: timeSpent };
}

export const lockAndUpdateTestScore = async (userId: string, activeTestId: string) => {
    // ------------- locking test
    const user = await User.findById(userId).select("activeTest");
    const updatedTest = await Test.findByIdAndUpdate(
        { _id: activeTestId },
        {
            $set: {
                testStatus: "LOCKED",
            },
        },
        {
            new: true,
        }
    );

    if (updatedTest) {
        if (user) {
            user.activeTest = null;
            await user.save();
        }
    }
    else
        return false;

    // ------------- updating score
    const updateStatus = await evaluateAndUpdateTestScore(activeTestId.toString());
    if (updateStatus)
        console.log("Score evaluated and updated");
    else
        console.log("Score not updated");

    return true;
}

export const updateTestCompletionAndTimeSpent = async (activeTestId: ObjectId, setName: string) => {

    const test = await Test.aggregate([
        {
            $match: { _id: activeTestId },
        },
        {
            $unwind: "$sets",
        },
        {
            $unwind: "$sets.answers",
        },
        {
            $group: {
                _id: {
                    testId: "$_id",
                    setName: "$sets.setName",
                },
                testStatus: { $first: "$testStatus" },
                testTimeSpent: { $first: "$testTimeSpent" },
                setStatus: { $first: "$sets.setStatus" },
                setSetStartTime: { $first: "$sets.setStartTime" },
                setTimeSpent: { $first: "$sets.timeSpent" },
                answers: {
                    $push: {
                        questionId: "$sets.answers.questionId",
                        questionStatus: "$sets.answers.questionStatus",
                    },
                },
            },
        },
        {
            $group: {
                _id: "$_id.testId",
                testStatus: { $first: "$testStatus" },
                testTimeSpent: { $first: "$testTimeSpent" },
                sets: {
                    $push: {
                        setName: "$_id.setName",
                        setStatus: "$setStatus",
                        setSetStartTime: "$setSetStartTime",
                        setTimeSpent: "$setTimeSpent",
                        answers: "$answers",
                    },
                },
            },
        },

    ]);

    const testCompletionPercentage: number = evaluateTestCompletion(test[0]);
    const { testTimeSpent, setTimeSpent } = evaluateSetTimeSpent(test[0], setName);

    // console.log("__setTimeSpent", setTimeSpent, "__newtestTimeSpent", testTimeSpent)

    // updating set time spent and completion percentage of test
    const updatedSetSpentTimeAndCompletionPercent = await Test.findByIdAndUpdate(
        { _id: activeTestId, "sets.setName": setName },
        {
            $set: {
                "testCompletionPercent": testCompletionPercentage,
                "testTimeSpent": testTimeSpent,
                "sets.$[set].timeSpent": setTimeSpent,
                "sets.$[set].setStartTime": null,
            },
        },
        {
            new: true,
            arrayFilters: [{ "set.setName": setName }],
        }
    );

    return updatedSetSpentTimeAndCompletionPercent;
}

export const getActiveTestAndTestTemplateId = async ( userId:string)=>{

    const userTest = await User.aggregate([
        { 
            $match: { _id: new mongoose.Types.ObjectId(userId) } 
        },
        {
            $project: {
                activeTest: 1,
                testIds: 1
            }
        },
        {
            $unwind: "$testIds"
        },
        {
            $project: {
                activeTest: 1,
                testId: "$testIds.testId",
                testTemplateId: "$testIds.testTemplateId"
            }
        },
        {
            $match: {
                $expr: { $eq: ["$testId", "$activeTest"] }
            }
        },
        {
            $project: {
                _id: 0,
                testTemplateId: 1,
                activeTest: 1
            }
        }
    ]);

    return userTest.length !=0 ? userTest[0] : [];
}