import { Schema, model, Document } from 'mongoose';
import { QuestionStatusEnum, TestStatusEnum } from '../types/enum';

// interface AnswerType {
//     questionId: Schema.Types.ObjectId;
//     questionStatus: QuestionStatusEnum;
//     correctAnswer: string[][];
//     userAnswer?: string[][];
//     userAnswerAccuracy?: Number | null;
//     isCorrect: boolean | null;
//     questionStartTime?: Date | null;
//     questionEndTime?: Date | null;
//     timeTaken?: Number;
// }

// interface TestType extends Document {
//     testTemplateId: Schema.Types.ObjectId;
//     testStatus: TestStatusEnum;
//     testStartTime: Date | null;
//     testTimeLimit: Number;
//     testTimeSpent: Number;
//     testCompletionPercent: Number;
//     totalScore: Number | null;
//     // verbalScore: Number | null;
//     // quantitativeScore: Number | null;
//     answers: AnswerType[];
//     testMode :string;
// }

// const answerSchema = new Schema<AnswerType>({
//     questionId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Question',
//         required: true
//     },
//     questionStatus: {
//         type: String,
//         enum: Object.values(QuestionStatusEnum),
//         default: QuestionStatusEnum.UNSEEN
//     },
//     userAnswer: {
//         type: [[String]]
//     },
//     correctAnswer: {
//         type: [[String]]
//     },
//     userAnswerAccuracy: {
//         type: Number,
//         default: null
//     },
//     isCorrect: {
//         type: Boolean,
//         default: null
//     },
//     questionStartTime: {
//         type: Date,
//         default: null
//     },
//     questionEndTime: {
//         type: Date,
//     },
//     timeTaken: {
//         type: Number,
//         default: 0
//     }
// }, {
//     timestamps: true
// });

// const testSchema = new Schema<TestType>({
//     testTemplateId: {
//         type: Schema.Types.ObjectId,
//         ref: 'TestTemplate'
//     },
//     testMode: {
//         type: String,
//         enum: ['TEST', 'LEARN'],
//         default: 'TEST'
//     },
//     testStatus: {
//         type: String,
//         enum: Object.values(TestStatusEnum),
//         default: TestStatusEnum.NOT_STARTED
//     },
//     testStartTime: {
//         type: Date,
//         default: null
//     },
//     testTimeLimit: {
//         type: Number,
//         default: 88 * 60  // 18+23+21+26
//     },
//     testTimeSpent: {
//         type: Number,
//         default: 0
//     },
//     testCompletionPercent: {
//         type: Number,
//         default: 0
//     },
//     totalScore: {
//         type: Number,
//         default: null
//     },
//     answers: [answerSchema]
// }, {
//     timestamps: true
// });


// const Test = model<TestType>('Test', testSchema);
// export default Test;




interface AnswerType {
    questionId: Schema.Types.ObjectId;
    questionStatus: QuestionStatusEnum;
    correctAnswer: string[][];
    userAnswer?: string[][];
    userAnswerAccuracy?: number | null;
    isCorrect: boolean | null;
    questionStartTime?: Date | null;
    questionEndTime?: Date | null;
    timeTaken?: number;
}

interface TestType extends Document {
    userId: Schema.Types.ObjectId;  // Link test to user
    testTemplateId: Schema.Types.ObjectId;
    testStatus: TestStatusEnum;
    testStartTime: Date | null;
    testTimeLimit: number;
    testTimeSpent: number;
    testCompletionPercent: number;
    totalScore: number | null;
    // testMode: string;
    answers: AnswerType[];
}

const answerSchema = new Schema<AnswerType>({
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    questionStatus: {
        type: String,
        enum: Object.values(QuestionStatusEnum),
        default: QuestionStatusEnum.UNSEEN
    },
    userAnswer: {
        type: [[String]]
    },
    correctAnswer: {
        type: [[String]]
    },
    userAnswerAccuracy: {
        type: Number,
        default: null
    },
    isCorrect: {
        type: Boolean,
        default: null
    },
    questionStartTime: {
        type: Date,
        default: null
    },
    questionEndTime: {
        type: Date,
    },
    timeTaken: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const testSchema = new Schema<TestType>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testTemplateId: {
        type: Schema.Types.ObjectId,
        ref: 'TestTemplate',
        required: true,
        validate: {
            validator: async function (value: Schema.Types.ObjectId) {
                const user = await model('User').findById(this.userId).populate('purchasedPackages');
                if (!user) return false;

                const packageData = await model('Package').findOne({ name: user.purchasedPackages });
                return packageData?.testTemplateIds.includes(value);
            },
            message: 'Selected test template is not available in the purchased package.'
        }
    },
    // testMode: {
    //     type: String,
    //     enum: ['PRELIMS', 'PYQ'],
    //     default: 'COMBINED'
    // },
    testStatus: {
        type: String,
        enum: Object.values(TestStatusEnum),
        default: TestStatusEnum.NOT_STARTED
    },
    testStartTime: {
        type: Date,
        default: null
    },
    testTimeLimit: {
        type: Number,
        default: 120 * 60  // 18+23+21+26
    },
    testTimeSpent: {
        type: Number,
        default: 0
    },
    testCompletionPercent: {
        type: Number,
        default: 0
    },
    totalScore: {
        type: Number,
        default: null
    },
    answers: [answerSchema]
}, {
    timestamps: true
});

const Test = model<TestType>('Test', testSchema);
export default Test;
