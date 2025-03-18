import { Box, Typography } from "@mui/material";
import AnalysisHeader from "../../components/analysis/AnalysisHeader";
import OverAllAnalysis from "../../components/analysis/OverAllAnalysis";
import TopicWiseAnalysis from "../../components/analysis/TopicWiseAnalysis";
import UserInfo from "../../components/analysis/UserInfo";
import TopicWiseBarGraph from "../../components/analysis/TopicWiseBarGraph ";

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
  totalScore: number;
  maxScore: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  correctScore: number;
  negativeMarks: number;
  timeTaken: string;
}

const Analysis = () => {
  
  const data:TopicAnalysis[] = [
    { topic: "History", totalQuestions: 1, correct: 1, incorrect: 0, notAttempted: 0, difficulty: "Medium", accuracy: 100, timeTaken: "00:50 minutes" },
    { topic: "Geography", totalQuestions: 2, correct: 1, incorrect: 1, notAttempted: 0, difficulty: "Hard", accuracy: 50, timeTaken: "00:50 minutes" },
    { topic: "Polity & Governance", totalQuestions: 1, correct: 1, incorrect: 0, notAttempted: 0, difficulty: "Easy", accuracy: 100, timeTaken: "00:50 minutes" },
    { topic: "Economy", totalQuestions: 1, correct: 1, incorrect: 0, notAttempted: 0, difficulty: "Medium", accuracy: 100, timeTaken: "00:50 minutes" },
    { topic: "Environment & Ecology", totalQuestions: 1, correct: 1, incorrect: 0, notAttempted: 0, difficulty: "Hard", accuracy: 100, timeTaken: "00:50 minutes" },
    { topic: "Current Affairs", totalQuestions: 1, correct: 1, incorrect: 0, notAttempted: 0, difficulty: "Hard", accuracy: 100, timeTaken: "00:50 minutes" },
    { topic: "Science & Technology", totalQuestions: 1, correct: 1, incorrect: 0, notAttempted: 0, difficulty: "Hard", accuracy: 100, timeTaken: "00:50 minutes" },
  ];
  
  
  const user: UserTypes = {
    name: "John Smith",
    email: "JohnSmith@john.com",
    testAttempt: 4,
    totalTimeTaken: "3 hrs 45 min",
    totalScore: 325,
    maxScore: 400,
    totalQuestions: 100,
    attempted: 80,
    correct: 60,
    incorrect: 50,
    correctScore: 120,
    negativeMarks: 13.2,
    timeTaken: "79:50 minutes",
  };

  return (
    <Box sx={{ px: 15 }}>
      <AnalysisHeader />
      <UserInfo user={user} />
      <Typography
        align="center"
        sx={{ fontSize:"40px",fontWeight: "bold", mt: 10 }}
      >
        Total Score:{user.totalScore}<span style={{fontSize:"25px",fontWeight:"lighter"}}>/{user.maxScore}</span>
      </Typography>
      <OverAllAnalysis user={user} />
      <TopicWiseAnalysis data={data} />
      <TopicWiseBarGraph  data={data}/>
    </Box>
  );
};

export default Analysis;
