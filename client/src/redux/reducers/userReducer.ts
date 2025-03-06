import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login } from "../actions/userActions";

export enum AuthStates {
  AUTHENTICATED = "AUTHENTICATED",
  INITIALIZING = "INITIALIZING",
  IDLE = "IDLE",
  ERROR = "ERROR",
}

interface Test {
  testId: string;
  testTemplateId: string;
  testName: string;
  startDate?: string;
  completeDate?: string;
  testTimeSpent?: number;
  testTimeLimit?: number;
  verbalScore?: number;
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
  authState: AuthStates.IDLE,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.userId = null;
      state.name = "";
      state.email = "";
      state.authState = AuthStates.IDLE;
      state.error = null;
      state.completedTests = [];
      state.inProgressTests = [];
      state.unAttemptedTests = [];
    },
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      state.authState = action.payload.authState ?? state.authState;
      state.inProgressTests =
        action.payload.inProgressTests ?? state.inProgressTests;
      state.error = action.payload.error ?? state.error;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.authState = AuthStates.INITIALIZING;
        state.error = null;
        state.loading = true;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: Omit<UserState, "loading" | "error"> }>) => {
          state.authState = AuthStates.AUTHENTICATED;
          state.userId = action.payload.user.userId;
          state.name = action.payload.user.name;
          state.email = action.payload.user.email;
          state.completedTests = action.payload.user.completedTests;
          state.inProgressTests = action.payload.user.inProgressTests;
          state.unAttemptedTests = action.payload.user.unAttemptedTests;
          state.loading = false;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.authState = AuthStates.ERROR;
        state.error = typeof action.payload === "string" ? action.payload : "Login failed";
        state.loading = false;
      });
  },
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;
