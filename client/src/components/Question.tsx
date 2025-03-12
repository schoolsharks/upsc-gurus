import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import {
  markQuestion,
  setQuestions,
  updateUserResponse,
} from "../redux/reducers/questionReducer";
import userApi from "../api/userApi";
import TestHeader from "./TestHeader";
import TestSidebar from "./TestSidebar";
import { selectQuestions } from "../redux/reducers/questionReducer";
import { Question } from "../types/QuestionType";
import "../styles/QuestionStyles.css";
import DOMPurify from "dompurify";

const QuestionComponent: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[][]>([]);
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const testId = useParams().testId;
  const questions = useSelector(selectQuestions);
  const index = parseInt(queryParams.get("question") || "0", 10);
  const currentQuestion = questions[index];

  useEffect(() => {
    if (!currentQuestion || !questions || !questions[index]) return;

    const startQuestionTimer = async () => {
      try {
        await userApi.put("/test/startQuestionTime", {
          testId,
          questionId: currentQuestion.questionId,
        });
        dispatch(
          markQuestion({
            questionId: currentQuestion.questionId,
            questionStatus: "SEEN",
          })
        );
      } catch (error: any) {
        console.error(
          "Error starting question timer:",
          error?.response?.data || error.message
        );
      }
    };

    startQuestionTimer();
  }, [index, currentQuestion?.questionId, testId, questions]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await userApi.get<{ questionsList: Question[] }>(
          "/test/getQuestions",
          {
            params: { testId },
          }
        );
        dispatch(setQuestions(response.data.questionsList));
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

    // Check if the selected option is already chosen
    if (selectedAnswers.length > 0 && selectedAnswers[0] === option) {
      updatedAnswers = [[]]; // Unselecting the option
    } else {
      updatedAnswers = [option]; // Selecting the option
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
          userResponse: updatedResponse,
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
                    className="question-html text-[1.25rem] px-8"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(currentQuestion.question),
                    }}
                  />
                </div>
                <div className="options-container w-fit mx-auto">
                  <div className="options-section flex flex-col gap-2 justify-center">
                    {currentQuestion.optionType === "singleCorrectMCQ" &&
                      currentQuestion.options.map((option, idx) => {
                        const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
                        return (
                          <button
                            key={idx}
                            className={`inline-flex items-center gap-4 py-2 px-3 border rounded-md min-w-max whitespace-nowrap ${
                              selectedAnswers.length > 0 &&
                              selectedAnswers[0] === option
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
      <div className="w-[350px]">
        <TestSidebar questions={questions} />
      </div>
    </div>
  );
};

export default QuestionComponent;
