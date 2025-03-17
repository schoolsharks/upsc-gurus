import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  fetchQuestions,
  // fetchSectionalTestQuestions,
} from "../actions/questionActions";

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

// QuestionSet interface
// export interface QuestionSet {
//   setName?: string;
//   setStatus?: string;
//   timeLimit: number;
//   timeRemaining: number;
//   timeSpent: number;
//   questionDetails: Question[];
// }

// QuestionState interface
interface QuestionState {
  questions: Question[]; // Flattened question details
  // questionSets: QuestionSet[];
  timeRemaining:number | null ;
  isLoading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  questions: [],
  // questionSets: [],
  isLoading: false,
  timeRemaining:null,
  error: null,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    // setQuestionSets: (state, action: PayloadAction<QuestionSet[]>) => {
    //   state.questionSets = action.payload;
    // },
    updateTimeRemaining: (state, action) => {
      if (state.timeRemaining) {
        state.timeRemaining =
          state.timeRemaining - action.payload;
      }
      else{
        state.timeRemaining=action.payload
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
          // state.questionSets = action.payload;

          // Flatten the question details for easy access
          // console.log(
          //   action.payload.flatMap((set) => console.log(set.questionDetails))
          // );
          state.timeRemaining=action.payload.timeRemaining;
          state.questions = action.payload.questionDetails;
        } else {
          console.warn("No questions received from the API.");
        }
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch questions.";
      })

      // // active sectional test questions
      // .addCase(fetchSectionalTestQuestions.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      // .addCase(fetchSectionalTestQuestions.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   console.log("action.payload", action.payload);
      //   if (action.payload) {
      //     state.questionSets = action.payload;

      //     // Flatten the question details for easy access
      //     console.log(
      //       action.payload.flatMap((set) => console.log(set.questionDetails))
      //     );

      //     state.questions = action.payload.flatMap(
      //       (set) =>
      //         set?.questionDetails?.map((detail) => ({
      //           ...detail,
      //           section: set.setName,
      //         })) || []
      //     );
      //   } else {
      //     console.warn("No questions received from the API.");
      //   }
      // })
      // .addCase(fetchSectionalTestQuestions.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error =
      //     (action.payload as string) || "Failed to fetch questions.";
      // });
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
  // setQuestionSets,
  setQuestions,
  updateUserResponse,
  updateTimeRemaining,
  markQuestion,
} = questionSlice.actions;

// Export reducer
export default questionSlice.reducer;
