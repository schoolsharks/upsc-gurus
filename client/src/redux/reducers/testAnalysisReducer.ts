import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  fetchQuestions,
} from "../actions/questionActions";

// Question interface
export interface Question {
  questionId: string;
  question: string;
  options: string[][];
  optionType: string;
  difficulty: string;
  questionStatus: string;
  userResponse: string[][];
  section: string;
  userAnswer?: string[][];
  correctAnswer?:string[];
  isCorrect?: boolean;
}

interface Topic {
  accuracy: number;
  correct: number;
  incorrect: number;
  notAttempted: number;
  totalQuestions: number;
  topicId: string;
  totalTimeSpent: number;
}

// Define the complete analytics structure that matches the API response
export interface TestAnalyticsResponse {
  attemptedCount: number;
  correctAnswerScore: number;
  correctCount: number;
  incorrectCount: number;
  negativeMarks: number;
  reviewTest: Question[];
  testTimeSpent: number;
  topicWiseAnalysis: Topic[];
  totalQuestions: number;
}

export interface TestAnalysisState {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  attemptedCount: number;
  correctAnswerScore: number;
  correctCount: number;
  incorrectCount: number;
  negativeMarks: number;
  testTimeSpent: number;
  totalQuestions: number;
  topicWiseAnalysis: Topic[];
}

const initialState: TestAnalysisState = {
  questions: [],
  isLoading: false,
  error: null,
  attemptedCount: 0,
  correctAnswerScore: 0,
  correctCount: 0,
  incorrectCount: 0,
  negativeMarks: 0,
  testTimeSpent: 0,
  totalQuestions: 0,
  topicWiseAnalysis: [],
};

const testAnalytics = createSlice({
  name: "question",
  initialState,
  reducers: {
    setTestQuestions: (state, action: PayloadAction<Question[]>) => {
      console.log("action.payload", action.payload);
      state.questions = action.payload;
    },
    updateTestAnalytics: (
      state,
      action: PayloadAction<TestAnalyticsResponse>
    ) => {
      // Update all the analytics fields from the response
      state.attemptedCount = action.payload.attemptedCount;
      state.correctAnswerScore = action.payload.correctAnswerScore;
      state.correctCount = action.payload.correctCount;
      state.incorrectCount = action.payload.incorrectCount;
      state.negativeMarks = action.payload.negativeMarks;
      state.testTimeSpent = action.payload.testTimeSpent;
      state.totalQuestions = action.payload.totalQuestions;
      state.topicWiseAnalysis = action.payload.topicWiseAnalysis;
    },
    // Keep this reducer for updating individual questions
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
export const selectTestQuestions = (state: RootState) =>
  state.question.questions;
export const selectTestQuestionSets = (state: RootState) =>
  state.question.questions;
export const selectIsLoading = (state: RootState) => state.question.isLoading;
export const selectError = (state: RootState) => state.question.error;

// Export actions
export const { setTestQuestions, updateTestAnalytics, updateUserResponse } = testAnalytics.actions;

// Export reducer
export default testAnalytics.reducer;