import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";

export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserTestInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.get("/test/userTestInfo");
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.post("/auth/login", { email, password });
      const { accessToken, user } = response.data;

      if (accessToken && user.id) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userId", user.id);
        return { user, accessToken };
      } else {
        return rejectWithValue("Login failed: No access token received.");
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed.");
    }
  }
);


