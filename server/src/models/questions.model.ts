import { Schema, model, Document } from "mongoose";
import { SectionEnum, DifficultyEnum } from "../types/enum";

interface QuestionType extends Document {
  section: SectionEnum;
  // subTopicId: Schema.Types.ObjectId;
  topic:string;
  question: string;
  positioning: "split" | "center" | "left";
  options?: string[][];
  correctAnswer: string[][];
  optionType:
    | "singleCorrectMCQ"
    | "multiCorrectMCQ"
    | "twoCorrectMCQ"
    | "blank"
    | "multiBlank"
    | "selectSentence"
    | "numerical"
    | "fractional";
  difficulty: DifficultyEnum;
  explanation: string;
  videoLink: string;
}

const questionSchema = new Schema<QuestionType>(
  {
    // subTopicId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "SubTopic",
    //   required: true,
    // },
    topic: {
      type: "String",
      // required: true,
      default:"Other"
    },
    question: {
      type: String,
      required: true,
    },
    optionType: {
      type: String,
      enum: [
        "singleCorrectMCQ",
        "multiCorrectMCQ",
        "twoCorrectMCQ",
        "singleBlank",
        "blank",
        "multiBlank",
        "selectSentence",
        "numerical",
        "fractional",
      ],
      required: true,
    },
    options: {
      type: [[String]],
    },
    correctAnswer: {
      type: [[String]],
    },

    difficulty: {
      type: String,
      enum: Object.values(DifficultyEnum),
      required: true,
    },
    explanation: {
      type: String,
    },
    videoLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Question = model<QuestionType>("Question", questionSchema);
export default Question;
