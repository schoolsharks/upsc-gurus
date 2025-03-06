import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.post("/auth/login", { email, password });
      const { accessToken, user } = response.data;

      if (accessToken && user.id) {
        localStorage.setItem("accessToken", accessToken);
        return { user, accessToken };
      } else {
        return rejectWithValue("Login failed: No access token received.");
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed.");
    }
  }
);
