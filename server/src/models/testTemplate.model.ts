import mongoose, { Document, Schema, model } from 'mongoose';

interface TestTemplateType extends Document {
  testName: string;
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
