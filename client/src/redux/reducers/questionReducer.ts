import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchQuestions } from "../actions/questionActions";

// Question interface
interface Question {
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

// QuestionState interface
interface QuestionState {
  questions: Question[];
  timeRemaining: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  questions: [],
  isLoading: false,
  timeRemaining: null,
  error: null,
};

// Timer action type
interface TimerAction {
  type: "init" | "decrement";
  value?: number;
}

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    updateTimeRemaining: (state, action: PayloadAction<TimerAction>) => {
      if (
        action.payload.type === "init" &&
        action.payload.value !== undefined
      ) {
        state.timeRemaining = action.payload.value;
      } else if (state.timeRemaining !== null && state.timeRemaining > 0) {
        state.timeRemaining = state.timeRemaining - 1;
      }
    },
    markQuestion: (state, action) => {
      state.questions = state.questions.map((q) => {
        if (q.questionId === action.payload.questionId) {
          return {
            ...q,
            questionStatus: action.payload.questionStatus,
          };
        } else {
          return { ...q };
        }
      });
    },
    updateUserResponse: (
      state,
      action: PayloadAction<{
        questionId: string;
        userResponse: string[][];
        questionStatus: string;
      }>
    ) => {
      const question = state.questions.find(
        (item) => item.questionId === action.payload.questionId
      );
      if (question) {
        question.userAnswer = action.payload.userResponse;
        question.questionStatus = action.payload.questionStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("action.payload", action.payload);

        if (action.payload) {
          state.timeRemaining = action.payload.timeRemaining;
          state.questions = action.payload.questionDetails;
        } else {
          console.warn("No questions received from the API.");
        }
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch questions.";
      });
  },
});

// Selectors for extracting questions and question sets
export const selectQuestions = (state: RootState) => state.question.questions;
export const selectQuestionSets = (state: RootState) =>
  state.question.questions;
export const selectIsLoading = (state: RootState) => state.question.isLoading;
export const selectError = (state: RootState) => state.question.error;

// Export actions
export const {
  setQuestions,
  updateUserResponse,
  updateTimeRemaining,
  markQuestion,
} = questionSlice.actions;

// Export reducer
export default questionSlice.reducer;
