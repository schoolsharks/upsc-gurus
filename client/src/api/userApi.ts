import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const userApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
});

userApi.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.data.accessToken && response.data.refreshToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return response;
  },

  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken)
          throw new Error("Refresh token not available. Please log in again.");

        console.log("Attempting token refresh...");
        const { data } = await axios.post<Tokens>(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/handleRefreshToken`,
          {},
          { withCredentials: true }
        );

        console.log("Token refreshed:", data);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        userApi.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

        return userApi(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      }
    }

    console.error("API call error:", error);
    return Promise.reject(error); // Reject the promise to stop further retries
  }
);

export default userApi;
