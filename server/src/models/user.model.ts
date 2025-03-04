import { Schema, model, Document } from 'mongoose';

interface UserType extends Document {
    email: string;
    password: string;
    paymentStatus: boolean;
    testIds: { testId: Schema.Types.ObjectId; testTemplateId: Schema.Types.ObjectId }[];
    activeTest: Schema.Types.ObjectId | null;
    testAttempts: number;
    refreshToken: string;
    accessToken: string;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date;
}

const userSchema = new Schema<UserType>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: Boolean,
        default: false
    },
    testIds: [
        {
            testId: {
                type: Schema.Types.ObjectId,
                ref: 'Test',
                required:true
            },
            testTemplateId:{
                type:Schema.Types.ObjectId,
                ref: 'TestTemplate',
                // required:true
            }
        }
    ],
    activeTest: {
        type: Schema.Types.ObjectId,
        ref: 'Test',
        default: null
    },
    testAttempts: {
        type: Number,
        default: 0
    },

    refreshToken: {
        type: String,
        default: null
    },
    accessToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
},
    {
        timestamps: true
    }
);

const User = model<UserType>('User', userSchema);
export default User;
