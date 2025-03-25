import mongoose, { Document, Schema, model } from 'mongoose';
import { TestTypes } from '../types/enum';



interface TestTemplateType extends Document {
  testName: string;
  type:TestTypes;
  hidden:boolean;
  active: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  questionIds: mongoose.Types.ObjectId[];
}

const testTemplateSchema = new Schema<TestTemplateType>(
  {
    testName: {
      type: String,
      required: true,
      unique: true,
    },
    type:{
      type:String,
      enum:Object.values(TestTypes),
      required:true
    },
    hidden:{
      type:Boolean,
      default:false,
      required:true
    },
    active: {
      type: Boolean,
      default: false,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    questionIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question', // directly reference the 'Question' collection
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TestTemplate = model<TestTemplateType>('TestTemplate', testTemplateSchema);
export default TestTemplate;
