import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import questionReducer from "./reducers/questionReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    question: questionReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
