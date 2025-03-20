import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import userApi from "../api/userApi";
// import { Question } from "../types/QuestionType";
import "../styles/QuestionStyles.css";
import DOMPurify from "dompurify";
import TestBottom from "./TestBottom";
import ReviewTestSidebar from "./ReviewTestSidebar";
import {
  Question,
  setTestQuestions,
  updateTestAnalytics,
} from "../redux/reducers/testAnalysisReducer";
import { RootState } from "../redux/store";
import { Cancel, Check } from "@mui/icons-material";
import AnalysisHeader from "./analysis/AnalysisHeader";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
interface TestAnalyticsResponse {
  attemptedCount: number;
  correctAnswerScore: number;
  correctCount: number;
  incorrectCount: number;
  negativeMarks: number;
  reviewTest: Question[]; // This contains the questions
  testTimeSpent: number;
  topicWiseAnalysis: any[];
  totalQuestions: number;
}
const ReviewTest: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const { testId } = useParams<{ testId: string }>();
  const questions = useSelector(
    (state: RootState) => state.testAnalytics.questions
  );
  const currentIndex = parseInt(queryParams.get("question") || "0", 10);
  const currentQuestion = questions[currentIndex];
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 1024);
  const navigate = useNavigate();
  const totalQuestions = questions.length;
  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(true); // Always show sidebar on lg screens and above
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await userApi.get<TestAnalyticsResponse>(
          "/analysis/getTestAnalytics",
          {
            params: { testId },
          }
        );
        dispatch(setTestQuestions(response.data.reviewTest ?? []));
        console.log(response.data.reviewTest);
        dispatch(updateTestAnalytics(response.data));
      } catch (error: any) {
        console.log(
          error.response?.data?.message || "Failed to fetch user information."
        );
      }
    };

    fetchQuestions();
  }, [testId, dispatch]);

  const handleNavigation = (direction: "next" | "prev") => {
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < totalQuestions) {
      navigate(`${location.pathname}?question=${newIndex}`);
    }
  };



  return (
    <div className=" min-w-screen ">
      <div className="flex-1">
        <div className="px-12">
          <AnalysisHeader />
        </div>
        <div className="test-copy-disable mt-5">
          <div className={`question-container flex flex-col gap-10`}>
            {currentQuestion ? (
              <>
                <div className="flex flex-col ">
                  <div className="text-[#707070] text-[1.2rem] mb-2 px-8 lg:px-16">
                    Question: {currentIndex + 1}
                  </div>
                  <div
                    className="question-html md:text-[1.25rem] px-8 lg:px-16"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(currentQuestion.question),
                    }}
                  />
                </div>
                <div className="options-container w-full md:w-[70%] px-2 sm:px-8 lg:px-16">
                  <div className="options-section flex flex-col gap-2 text-[0.9rem] sm:text-[1rem]">
                    {currentQuestion.options.map((option, idx) => {
                      const optionLetter = String.fromCharCode(65 + idx);
                      const isUserAnswer =
                        JSON.stringify(currentQuestion.userAnswer?.[0]) ===
                        JSON.stringify(option);

                      return (
                        <button
                          key={idx}
                          className={`inline-flex items-center gap-4 py-2 px-3 border rounded-md min-w-max whitespace-nowrap ${
                            isUserAnswer ? "bg-gray-200 border-black" : ""
                          }`}
                          disabled
                        >
                          <span className="w-8 h-8 flex items-center justify-center rounded-full border">
                            {optionLetter}
                          </span>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : null}
            <div className="flex gap-4 px-16 mt-4 items-center">
              {currentQuestion?.userAnswer?.length ? (
                <div
                  className={`font-semibold ${
                    currentQuestion?.isCorrect
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {currentQuestion?.isCorrect ? (
                    <div>
                      <Check /> Correct
                    </div>
                  ) : (
                    <div>
                      <Cancel /> Incorrect
                    </div>
                  )}
                </div>
              ) : null}

              {(!currentQuestion?.isCorrect ||
                !currentQuestion?.userAnswer?.length) && (
                <div className="text-[1rem]">
                  Correct option is{" "}
                  {currentQuestion?.options.findIndex(
                    (option) =>
                      JSON.stringify(option) ===
                      JSON.stringify(currentQuestion?.correctAnswer?.[0])
                  ) !== -1
                    ? String.fromCharCode(
                        65 +
                          currentQuestion?.options.findIndex(
                            (option) =>
                              JSON.stringify(option) ===
                              JSON.stringify(
                                currentQuestion?.correctAnswer?.[0]
                              )
                          )
                      )
                    : null}{" "}
                  : {currentQuestion?.correctAnswer?.[0]}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[280px] sm:w-[320px] absolute top-16 md:top-24 right-0 z-10">
        {showSidebar && <ReviewTestSidebar questions={questions} />}
      </div>
      <TestBottom
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        questionId={currentQuestion?.questionId}
      />
      <div className="flex justify-between max-w-[75%] text-lg px-16 mt-16"><div className="flex gap-2 items-center cursor-pointer" onClick={()=>handleNavigation("prev")}><BsArrowLeft size={24}/><span >Previous Question</span></div>
      <div className="flex gap-2 items-center flex-row-reverse cursor-pointer" onClick={()=>handleNavigation("next")}><BsArrowRight size={24}/><span >Next Question</span></div></div>
    </div>
  );
};

export default ReviewTest;
