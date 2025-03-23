import { Box, Typography } from "@mui/material";
import AnalysisHeader from "../../components/analysis/AnalysisHeader";
import UserInfo from "../../components/analysis/UserInfo";
import OverAllAnalysis from "../../components/analysis/OverAllAnalysis";
import TopicWiseAnalysis from "../../components/analysis/TopicWiseAnalysis";
import TopicWiseBarGraph from "../../components/analysis/TopicWiseBarGraph";
import { useEffect, useRef } from "react";
import userApi from "../../api/userApi";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setTestQuestions,
  updateTestAnalytics,
} from "../../redux/reducers/testAnalysisReducer";
import { RootState } from "../../redux/store";
import { downloadAnalyticsPdf } from "../../utils/downloadAnalytics.ts";

export interface TopicAnalysis {
  topic: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  notAttempted: number;
  difficulty: "Easy" | "Medium" | "Hard";
  accuracy: number;
  timeTaken: string;
}

export interface UserTypes {
  name: string;
  email: string;
  testAttempt: number;
  totalTimeTaken: string;
  totalScore: string;
  maxScore: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  correctScore: number;
  negativeMarks: number;
  timeTaken: string;
}

// Define the API response interface to match the actual structure
interface TestAnalyticsResponse {
  attemptedCount: number;
  correctAnswerScore: number;
  correctCount: number;
  incorrectCount: number;
  negativeMarks: number;
  reviewTest: any[]; // This contains the questions
  testTimeSpent: number;
  topicWiseAnalysis: any[];
  totalQuestions: number;
}

const Analysis = () => {
  const { testId } = useParams<{ testId: string }>();
  const pageRef=useRef<HTMLDivElement>(null)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await userApi.get<TestAnalyticsResponse>(
          "/analysis/getTestAnalytics",
          {
            params: { testId },
          }
        );
        console.log("response", response);
        dispatch(setTestQuestions(response.data.reviewTest ?? []));
        dispatch(updateTestAnalytics(response.data));
      } catch (error: any) {
        console.log(
          error.response?.data?.message || "Failed to fetch user information."
        );
      }
    };

    fetchQuestions();
  }, [testId, dispatch]);

  const report = useSelector((state: RootState) => state.testAnalytics);
  const topicReport = useSelector(
    (state: RootState) => state.testAnalytics.topicWiseAnalysis
  );
  console.log(topicReport);
  const formatTime = (seconds: number) => {
    if (!seconds && seconds !== 0) return "00:00";

    // Calculate hours and minutes
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    // Format with leading zeros if needed
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  };

  const processedTopicData =
    topicReport && topicReport.length > 0
      ? topicReport.map((item) => {
          // Determine difficulty based on accuracy (this is just an example, adjust as needed)
          let difficulty: "Easy" | "Medium" | "Hard";
          const accuracyNum = item.accuracy;
          if (accuracyNum > 75) {
            difficulty = "Easy";
          } else if (accuracyNum > 40) {
            difficulty = "Medium";
          } else {
            difficulty = "Hard";
          }

          return {
            topic: item.topicId || "Unknown",
            totalQuestions: item.totalQuestions || 0,
            correct: item.correct || 0,
            incorrect: item.incorrect || 0,
            notAttempted: item.notAttempted || 0,
            difficulty: difficulty,
            accuracy: item.accuracy || 0,
            timeTaken: `${formatTime(item.totalTimeSpent || 0)} hrs`,
          };
        })
      : [];

  const user: UserTypes = {
    name: "John Smith",
    email: "JohnSmith@john.com",
    testAttempt: 4,
    totalTimeTaken: "3 hrs 45 min",
    totalScore: `${(report.correctAnswerScore - report.negativeMarks).toFixed(2)}`,
    maxScore: 200,
    totalQuestions: report.totalQuestions,
    attempted: report.attemptedCount,
    correct: report.correctCount,
    incorrect: report.incorrectCount,
    correctScore: report.correctAnswerScore,
    negativeMarks: report.negativeMarks,
    timeTaken: formatTime(report.testTimeSpent),
  };


  const handleDownloadAnalysis=()=>{
    downloadAnalyticsPdf(pageRef,testId??"")
  }

  return (
    <>
      <div className="px-24"><AnalysisHeader onDownloadAnalysis={handleDownloadAnalysis}/></div>
      <Box ref={pageRef} sx={{ px: 15 }}>
        <UserInfo user={user} />
        <Typography
          align="center"
          sx={{ fontSize: "40px", fontWeight: "bold", mt: 10 }}
        >
          Total Score:{user.totalScore}
          <span style={{ fontSize: "25px", fontWeight: "lighter" }}>
            /{user.maxScore}
          </span>
        </Typography>
        <OverAllAnalysis user={user} />
        <TopicWiseAnalysis data={processedTopicData} />
        <TopicWiseBarGraph data={processedTopicData} />
      </Box>
    </>
  );
};

export default Analysis;
