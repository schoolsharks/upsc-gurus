import { Schema, model, Document } from 'mongoose';

interface UserType extends Document {
    name:string;
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
    purchasedPackages: Schema.Types.ObjectId[]; // it is only condering array values 
    noOfAttempts:string;
    optionalSubject:string;
    city:string;
}   

const userSchema = new Schema<UserType>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        default: null
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
    },
    purchasedPackages: [{
        type:Schema.Types.ObjectId,
        ref: 'Package'
    }],
    noOfAttempts:{
        type:String,
        default:"_",
    },
    optionalSubject:{
        type:String,
        default:null
    },
    city:{
        type:String,
        default:null
    }
},
    {
        timestamps: true
    }
);

const User = model<UserType>('User', userSchema);
export default User;
