export interface Question {
    questionId: string;
    question: string;
    positioning: "left" | "center" | "split";
    options: string[][];
    optionType: string;
    difficulty: string;
    questionStatus: string;
    userResponse: string[][];
    section: string;
    userAnswer?: string[][];
  }