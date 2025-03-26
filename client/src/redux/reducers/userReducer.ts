import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserInfo, login } from "../actions/userActions";
import userApi from "../../api/userApi";

export enum AuthStates {
  AUTHENTICATED = "AUTHENTICATED",
  INITIALIZING = "INITIALIZING",
  IDLE = "IDLE",
  ERROR = "ERROR",
}

export enum TestTypes{
  TEST_SERIES = "TEST_SERIES",
  PYQS = "PYQS"
}

interface Test {
  testId: string;
  testTemplateId: string;
  testType:TestTypes;
  testName: string;
  unlockUrl:string;
  startDate?: string;
  completeDate?: string;
  testTimeSpent?: number;
  totalScore?: number;
  quantitativeScore?: number;
  testCompletionPercent?: number;
}

interface UserState {
  userId: string | null;
  name: string;
  email: string;
  completedTests: Test[];
  inProgressTests: Test[];
  unAttemptedTests: Test[];
  allTests: Test[];
  authState: AuthStates;
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: UserState = {
  userId: null,
  name: "",
  email: "",
  completedTests: [],
  inProgressTests: [],
  unAttemptedTests: [],
  allTests: [],
  authState: AuthStates.IDLE,
  loading: false,
  error: null,
};



export const forgetPassword = createAsyncThunk(
  "user/forgetPassword",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.put("/auth/forgetPassword", {
        email,
      });

      console.log("forgetPassword res", response);
      if (response.data.sucess === true) {
        console.log("reset link share on registered mailID");
        return 1;
      } else {
        return rejectWithValue(
          "Registration failed: No access token received."
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed: Server error."
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (
    {
      password,
      confirmPassword,
      token,
    }: { password: string; confirmPassword: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.put("/auth/resetPassword", {
        password,
        confirmPassword,
        token,
      });

      console.log("reset Password res", response);
      if (response.data.sucess === true) {
        console.log("reset link share on registered mailID");
        return 1;
      } else {
        return rejectWithValue("Password not updated.");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Password updation failed: Server error."
      );
    }
  }
);



const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.name = "";
      state.email = "";
      state.completedTests = [];
      state.inProgressTests = [];
      state.unAttemptedTests = [];
      state.allTests = [];
      state.authState = AuthStates.IDLE;
      state.error = null;
    },
    setUser(state, action) {
      state.authState = action.payload.authState ?? state.authState;
      state.inProgressTests =
        action.payload.inProgressTest ?? state.inProgressTests;
      state.error = action.payload.error ?? state.error;
    },
    setUserInfo(state, action) {
      // console.log("action.payload", action.payload);
      state.name= action.payload.userName ?? state.name;
      state.inProgressTests =
        action.payload.inProgressTest ?? state.inProgressTests;
      state.unAttemptedTests =
        action.payload.unAttemptedTest ?? state.unAttemptedTests;
      state.completedTests =
        action.payload.completedTest ?? state.completedTests;
        state.email = action.payload.email;
      state.error = action.payload.error ?? state.error;
      state.allTests =
        action.payload.allTests ?? state.allTests;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.authState = AuthStates.INITIALIZING;
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<any>) => {
        state.userId = action.payload._id;
        state.name = action.payload.userName;
        state.email = action.payload.email;
        state.completedTests = action.payload.completedTest;
        state.inProgressTests = action.payload.inProgressTest;
        state.unAttemptedTests = action.payload.unAttemptedTest;
        state.authState = AuthStates.AUTHENTICATED;
        state.loading = false;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.authState = AuthStates.IDLE;
      })
      .addCase(login.pending, (state) => {
        state.authState = AuthStates.INITIALIZING;
        state.error = null;
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.authState = AuthStates.AUTHENTICATED;
        state.name = action.payload.user.name;
        state.email = action.payload.user.email;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.authState = AuthStates.ERROR;
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { logout, setUser, setUserInfo } = userSlice.actions;
export default userSlice.reducer;
