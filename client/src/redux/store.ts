import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import questionReducer from "./reducers/questionReducer";
import testAnalyticsReducer from './reducers/testAnalysisReducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    question: questionReducer, 
    testAnalytics : testAnalyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
