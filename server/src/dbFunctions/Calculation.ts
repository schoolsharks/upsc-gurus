import mongoose, { ObjectId } from "mongoose";
import Test from "../models/test.model";
import { quantitativeTestScores, verbalTestScores } from "../utils/matrix";
// import { SectionalTest } from "../models/sectionalTest";

export const getCorrectAnswersCountForSet = async (activeTestId: string, setName: string) => {
    const getCorrectAnswersCount = await Test.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(activeTestId) }
        },
        {
            $unwind: "$sets"
        },
        {
            $match: {
                "sets.setName": setName
            }
        },
        {
            $unwind: "$sets.answers"
        },
        {
            $match: {
                "sets.answers.isCorrect": true
            }
        },
        {
            $group: {
                _id: {
                    testId: "$_id",
                    setName: "$sets.setName",
                },
                correctCount: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                testId: "$_id.testId",
                setName: "$_id.setName",
                correctCount: 1,
                questionIds: "$sets.answers.questionId"
            }
        }
    ]);
    // console.log("questionIds", getCorrectAnswersCount)
    return getCorrectAnswersCount.length > 0 ? Number(getCorrectAnswersCount[0].correctCount) : 0;
}

export const getAnswersDetailsForSet = async (activeTestId: string, setName: string) => {
    const getCorrectAnswersCount = await Test.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(activeTestId) }
        },
        {
            $unwind: "$sets"
        },
        {
            $match: {
                "sets.setName": setName
            }
        },
        {
            $unwind: "$sets.answers"
        },
        {
            $group: {
                _id: {
                    testId: "$_id",
                    setName: "$sets.setName",
                    setAverageScore: "$sets.setAverageScore",
                    timeSpent: "$sets.timeSpent",
                },
                trueCount: {
                    $sum: {
                        $cond: [{ $eq: ['$sets.answers.isCorrect', true] }, 1, 0]
                    }
                },
                falseCount: {
                    $sum: {
                        $cond: [{ $eq: ['$sets.answers.isCorrect', false] }, 1, 0]
                    }
                },
                nullCount: {
                    $sum: {
                        $cond: [{ $eq: ['$sets.answers.isCorrect', null] }, 1, 0]
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
                setName: "$_id.setName",
                setAverageScore: "$_id.setAverageScore",
                timeSpent: "$_id.timeSpent",
                trueCount: 1,
                falseCount: 1,
                nullCount: 1,
                questions: 1
            }
        }
    ]);
    // console.log("questionIds", getCorrectAnswersCount[0])
    return getCorrectAnswersCount.length > 0 ? getCorrectAnswersCount[0] : null;
}

export const getQuestionIdsForSet = async (activeTestId: ObjectId, setName: string) => {
    const questionIds = await Test.aggregate([
        {
            $match: {
                _id: activeTestId,
            }
        },
        {
            $unwind: "$sets"
        },
        {
            $match: {
                "sets.setName": setName
            }
        },
        {
            $unwind: "$sets.answers"
        },
        {
            $project: {
                _id: 0,
                questionId: "$sets.answers.questionId"
            }
        }
    ]);

    return questionIds.length > 0 ? questionIds.map(doc => doc.questionId) : [];
};

export const evaluateAndUpdateTestScore = async (testId: string) => {

    const verbalCorrectQues = await getAnswersDetailsForSet(testId, 'VERBAL');
    const quantitativeCorrectQues = await getAnswersDetailsForSet(testId, 'QUANTITATIVE');
    const verbal_2_CorrectQues = await getAnswersDetailsForSet(testId, 'VERBAL_2');
    const quantitative_2_CorrectQues = await getAnswersDetailsForSet(testId, 'QUANTITATIVE_2');

    let verbalScore: number = verbalTestScores[verbalCorrectQues?.trueCount][verbal_2_CorrectQues?.trueCount];
    let quantitativeScore: number = quantitativeTestScores[quantitativeCorrectQues?.trueCount][quantitative_2_CorrectQues?.trueCount];
    const totalScore: number = verbalScore + quantitativeScore;

    let verbalTimeSpent :number = verbalCorrectQues.timeSpent + verbal_2_CorrectQues.timeSpent;
    const quantitativeTimeSpent: number = quantitativeCorrectQues.timeSpent + quantitative_2_CorrectQues.timeSpent;
    const testTimeSpent = verbalTimeSpent + quantitativeTimeSpent;

    const updatesTest = await Test.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(testId) },
        {
            $set:{
                verbalScore : verbalScore,
                quantitativeScore : quantitativeScore,
                testTimeSpent : testTimeSpent
            }
        },
        { new : true}
    );

    if(!updatesTest)
        return false;
    else
        return true;
}

// ********************* SECTIONAL TEST **************************88
// export const    getAnswersDetailsForSectional = async (sectionalTestId: string) => {
//     const getCorrectAnswersCount = await SectionalTest.aggregate([
//         {
//             $match: { _id: new mongoose.Types.ObjectId(sectionalTestId) }
//         },
//         {
//             $unwind: "$answers"
//         },
//         {
//             $group: {
//                 _id: {
//                     sectionalTestId: "$_id",
//                     averageScore: "$averageScore",
//                     timeSpent: "$testTimeSpent",
//                     recommendedTime:"$recommendedTime"
//                 },
//                 trueCount: {
//                     $sum: {
//                         $cond: [{ $eq: ['$answers.isCorrect', true] }, 1, 0]
//                     }
//                 },
//                 falseCount: {
//                     $sum: {
//                         $cond: [{ $eq: ['$answers.isCorrect', false] }, 1, 0]
//                     }
//                 },
//                 nullCount: {
//                     $sum: {
//                         $cond: [{ $eq: ['$answers.isCorrect', null] }, 1, 0]
//                     }
//                 },
//                 questions: {
//                     $sum: 1
//                 }
//             }
//         },
//         {
//             $project: {
//                 _id: 0,
//                 sectionalTestId: "$_id.sectionalTestId",
//                 averageScore: "$_id.averageScore",
//                 timeSpent: "$_id.timeSpent",
//                 recommendedTime:"$_id.recommendedTime",
//                 trueCount: 1,
//                 falseCount: 1,
//                 nullCount: 1,
//                 questions: 1
//             }
//         }
//     ]);
//     return getCorrectAnswersCount.length > 0 ? getCorrectAnswersCount[0] : null;
// }

// export const getCorrectAnswerCountForSectional = async (sectionalTestId:string)=>{
//     const getCorrectAnswerCount = await SectionalTest.aggregate([
//         {
//             $match:{ _id: new mongoose.Types.ObjectId(sectionalTestId)}
//         },
//         {
//             $unwind:"$answers"
//         },
//         {
//             $match:{
//                 "answers.isCorrect":true
//             }
//         },
//         {
//             $group:{
//                 _id:{
//                     sectionalTestId:"$_id",
//                 },
//                 correctCount : {$sum:1},
//             }
//         },
//         {
//             $project:{
//                 _id:0,
//                 sectionalTestId:1,
//                 correctCount:1,
//             }
//         }
//     ]);

//     return getCorrectAnswerCount.length > 0 ? Number(getCorrectAnswerCount[0].correctCount) : 0;
// }

// export const evaluateAndUpdateSectionalScore = async(sectionalTestId:string)=>{

//     const correctQuestion  = await getCorrectAnswerCountForSectional(sectionalTestId);
//     const updatedSectionalTest = await SectionalTest.findByIdAndUpdate(
//         {_id: new mongoose.Types.ObjectId(sectionalTestId)},
//         {
//             $set:{
//                 score  : correctQuestion
//             }
//         },
//         {new :true}
//     );

//     if(!updatedSectionalTest)
//         return false;
//     else{
//         return true;
//     }
// }