import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import {
  selectQuestionSets,
  setQuestions,
  setQuestionSets,
  updateTimeRemaining,
  updateUserResponse,
} from "../redux/reducers/questionReducer";
import userApi from "../api/userApi";
import TestHeader from "./TestHeader";
import TestSidebar from "./TestSidebar";
import { selectQuestions } from "../redux/reducers/questionReducer";
import { Question } from "../types/QuestionType";
import "../styles/QuestionStyles.css";
import DOMPurify from "dompurify";

interface QuestionSet {
  setName?: string;
  setStatus?: string;
  timeLimit: number;
  timeRemaining: number;
  timeSpent: number;
  questionDetails: Question[];
}

const QuestionComponent: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const { testId } = useParams<{ testId: string }>();
  const questions = useSelector(selectQuestions);
  const [selectedAnswers, setSelectedAnswers] = useState<string[][]>([]);
  const index = parseInt(queryParams.get("question") || "0", 10);
  const currentQuestion = questions[index];
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 1024);
   const questionSets = useSelector(selectQuestionSets);
    const timeRemaining = questionSets?.timeRemaining;

    useEffect(() => {
    }, [timeRemaining]);
    useEffect(() => {
    if (timeRemaining <= 0) return;
  
    const timer = setInterval(() => {
      console.log("Dispatching time update...");
      dispatch(updateTimeRemaining(1)); 
    }, 1000);
  
    return () => clearInterval(timer);
  }, [timeRemaining, dispatch]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const time = formatTime(timeRemaining);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(true); // Always show sidebar on lg screens and above
      }
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startSetTimer = async (testId: string) => {
    try {
      let satrtSetResp;
      satrtSetResp = await userApi.put("/test/startTestTime", { testId });
      // start sectional test time
      await userApi.put("/sectional/startTestTime");

      console.log("Set timer started for:", testId, satrtSetResp);
    } catch (error) {
      console.error("Error starting set timer:", error);
    }
  };

  const endSetTimer = async (testId: string) => {
    try {
      await userApi.put("/test/endTestTime", { testId });

      // console.log("Set timer ended for", setName,endSetResp);
    } catch (error) {
      console.error("Error ending set timer:", error);
    }
  };

  const startQuestionTimer = async (
    testId: string,
    questionId: string,
    index: number
  ) => {
    try {
      await userApi.put("/test/startQuestionTime", {
        testId,
        questionId,
      });
      index; // To use unused variable (build errors resolution)

      // console.log("Question timer started for question:",index, questionId,startQuesResp);
    } catch (error) {
      console.error("Error starting question timer:", error);
    }
  };

  const endQuestionTimer = async (testId: string, questionId: string) => {
    try {
      await userApi.put("/test/endQuestionTime", {
        testId,
        questionId,
      });
      // console.log("Question timer ended for question: previous question",index-1,questionId, endQuesResp);
    } catch (error) {
      console.error("Error ending question timer:", error);
    }
  };
  
  // Effect for question timers
  useEffect(() => {
    if (!currentQuestion || !questions || !questions[index]) return;
    if (currentQuestion && index !== prevIndex&&testId) {
      startQuestionTimer(testId, currentQuestion.questionId, index);
    }

    if (prevIndex !== null && questions[prevIndex]) {
      endQuestionTimer(
        testId,
        questions[prevIndex].questionId
      );
    }
    setPrevIndex(index);
  }, [index, testId,questions]);

  // Effect for set timers
  useEffect(() => {
    if (!testId || questions.length === 0) return;
  
    startSetTimer(testId);
  
    const handleBeforeUnload = () => {
      endSetTimer(testId);
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      endSetTimer(testId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [testId, questions.length]); 
  
  //fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await userApi.get<{ questionsList: QuestionSet[] }>(
          "/test/getQuestions",
          {
            params: { testId },
          }
        );

        dispatch(
          setQuestions(response.data.questionsList?.questionDetails ?? [])
        );
        dispatch(setQuestionSets(response.data.questionsList));
      } catch (error: any) {
        console.log(
          error.response?.data?.message || "Failed to fetch user information."
        );
      }
    };

    fetchQuestions();
  }, [testId]);

  
  const handleSelectAnswer = (option: string[]) => {
    let updatedAnswers: string[][] = [];

    const isOptionSelected =
      selectedAnswers.length > 0 &&
      JSON.stringify(selectedAnswers[0]) === JSON.stringify(option);

    if (isOptionSelected) {
      updatedAnswers = [[]];
    } else {
      updatedAnswers = [option];
    }

    setSelectedAnswers(updatedAnswers);
    sendUserResponse(updatedAnswers);
  };

  const sendUserResponse = async (newSelectedAnswers: string[][]) => {
    console.log("user response");
    console.log(newSelectedAnswers);
    if (!currentQuestion?.questionId || !testId) return;

    try {
      const userResponse = {
        questionId: currentQuestion.questionId,
        userAnswer: newSelectedAnswers,
        testId,
      };
      console.log(userResponse);
      const response = await userApi.put(
        "/test/updateQuestionResponse",
        userResponse
      );
      console.log("response", response);
      const updatedResponse =
        response?.data?.updatedAnswer ?? structuredClone(newSelectedAnswers);
      const status = response.data.updatedAnswer.questionStatus;

      dispatch(
        updateUserResponse({
          questionId: currentQuestion.questionId,
          userResponse: updatedResponse.userAnswer,
          questionStatus: status,
        })
      );
    } catch (error: any) {
      console.error(
        "Error sending response:",
        error?.response?.data || error.message
      );
    }
  };

  return (
    <div className="flex min-w-screen">
      <div className="flex-1">
        <TestHeader
          currentIndex={index}
          totalQuestions={questions.length}
          questionId={currentQuestion?.questionId}
          setShowSidebar={setShowSidebar}
          showSidebar={showSidebar}
          time={time}
        />
        <div className="test-copy-disable mt-5">
          <div
            className={`question-container ${
              currentQuestion?.positioning === "left" ||
              currentQuestion?.positioning === "split"
                ? "left-positioning"
                : "center"
            }`}
          >
            {currentQuestion ? (
              <>
                <div className="question-section">
                  <div className="text-[#707070] text-[1.2rem] mb-2">
                    Question: {index + 1}
                  </div>
                  <div
                    className="question-html md:text-[1.25rem] px-8"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(currentQuestion.question),
                    }}
                  />
                </div>
                <div className="options-container w-full md:w-[70%] px-2 sm:px-4 md:mx-auto -mt-10">
                  <div className="options-section flex flex-col gap-2 justify-center text-[0.9rem] sm:text-[1rem]">
                    {currentQuestion.optionType === "singleCorrectMCQ" &&
                      currentQuestion.options.map((option, idx) => {
                        const optionLetter = String.fromCharCode(65 + idx);
                        return (
                          <button
                            key={idx}
                            className={`inline-flex items-center gap-4 py-2 px-3 border rounded-md min-w-max cursor-pointer whitespace-nowrap ${
                              selectedAnswers.length > 0 &&
                              JSON.stringify(selectedAnswers[0]) ===
                                JSON.stringify(option)
                                ? "bg-black text-white"
                                : "bg-white border-gray-300"
                            }`}
                            onClick={() => handleSelectAnswer(option)}
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
          </div>
        </div>
      </div>
      <div className="w-[280px] sm:w-[350px] absolute top-16 md:top-20 right-0 z-10 lg:relative lg:top-0">
        {showSidebar && <TestSidebar questions={questions} time={time}/>}
      </div>
    </div>
  );
};

export default QuestionComponent;
