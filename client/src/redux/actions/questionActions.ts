import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";
import axios from "axios";

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

interface QuestionSet {
    setName: string;
    setStatus: string;
    timeLimit: number;
    timeRemaining: number;
    timeSpent: number;
    questionDetails: Question[];
  }

export const fetchSectionalTestQuestions = createAsyncThunk(
  "question/fetchSectionalTestQuestions",
  async (_, thunkAPI) => {
    try {
      const response = await userApi.get<{ questionsList: QuestionSet[] }>(
        "/sectional/getQuestions"
      );
      console.log("Successful API response:", response.data);
      return response.data.questionsList;
    } catch (error) {
      console.error("Error occurred:", error);

      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response);
        if (error.response?.status === 410) {
          try {
            // Call the lockTestStatus API
            // const lockTestResponse = await userApi.put("/test/lockTestStatus");
            // console.log("Lock test status response:", lockTestResponse);
            //   // Navigate to test summary or end page
            //  window.location.href = "http://localhost:5173/test-key"
          } catch (lockTestError) {
            console.error("Error locking the test status:", lockTestError);
          }
        } else {
          console.error("Error in handleContinue:", error);
        }
      }
    }

    return thunkAPI.rejectWithValue("An unexpected error occurred");
  }
);


export interface QuestionList{
  timeLimit	:number;
  timeSpent	:number;
  timeRemaining : number;
  questionDetails	:Question[]; 
}

export const fetchQuestions = createAsyncThunk(
    "question/fetchQuestions",
    async ({ testId }: { testId: string }, thunkAPI) => {
      console.log("Fetching questions...");
      try {
        const response = await userApi.get<{ questionsList: QuestionList }>(
          "/test/getSecQuestion",
          { params: { testId } }
        );
        console.log("Successful API response:", response.data);
        return response.data.questionsList;
      } catch (error) {
        console.error("Error occurred:", error);
  
        if (axios.isAxiosError(error)) {
          console.error("Axios error response:", error.response);
          if (error.response?.status === 410) {
            try {
              // Call the lockTestStatus API
              // const lockTestResponse = await userApi.put("/test/lockTestStatus");
              // console.log("Lock test status response:", lockTestResponse);
              //   // Navigate to test summary or end page
              //  window.location.href = "http://localhost:5173/test-key"
            } catch (lockTestError) {
              console.error("Error locking the test status:", lockTestError);
            }
          } else {
            console.error("Error in handleContinue:", error);
          }
        }
      }
  
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  );