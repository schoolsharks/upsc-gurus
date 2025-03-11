import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/QuestionStyles.css";
import {
  setQuestions,
  // fetchQuestions,
  updateUserResponse,
} from "../redux/reducers/questionReducer";
import { Stack, Typography } from "@mui/material";
// import Header from "./Header";
import { AppDispatch, RootState } from "../redux/store";
// import VerbalQuestion from "../sections/verbal/SevenVerbalQuest";
import userApi from "../api/userApi";
import ExactlyMCQTwo from "../response/ExactlyMCQTwo";
import MCQSingleAnswer from "../response/MCQSingleAnswer";
import MCQMultipleAnswer from "../response/MCQMultipleAnswer";
import {
  selectQuestions,
  selectQuestionSets,
} from "../redux/reducers/questionReducer";
import DOMPurify from "dompurify";
// import useCheatProtection from "../hooks/useCheatProtection";
import SelectSentence from "../response/SelectSentence";
import { TestType } from "../types/enum";
import TestHeader from "./TestHeader";

interface HeaderProps {
  showHeader?: boolean;
  questionIndex?: number;
}

interface Question {
  questionId: string;
  question: string;
  positioning: "left" | "center" | "split";
  options: string[][];
  optionType: string;
  difficulty: string;
  questionStatus: string;
  userResponse: string[][];
  section: string;
  userAnswer?: string[][];
}

const QuestionComponent: React.FC<HeaderProps> = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[][]>([]);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const queryParams = new URLSearchParams(location.search);

  // useCheatProtection()
  const testId = useParams().testId;

  const questions = useSelector(selectQuestions);
  // const questionSets = useSelector(selectQuestionSets);
  //  console.log(questionSets,"all quest");

  // const setName = questionSets[0]?.setName;

  // const queryParams = new URLSearchParams(location.search);
  const index = parseInt(queryParams.get("question") || "0", 10);
  // let setName: string | null = questions[0]?.section ?? "0";
  // console.log(setName);

  const currentQuestion = questions[index];

  useEffect(() => {
    const selectUserResponses = (state: RootState) =>
      state.question.questions.map((q) => ({
        questionId: q.questionId,
        userResponse: q.userAnswer || [],
      }));
    console.log(selectUserResponses);
  }, []);
  // Function to send user responses to the API
  const sendUserResponse = async (newSelectedAnswers: string[][]) => {
    if (!currentQuestion?._id || !testId) return;

    try {
      const userResponse = {
        questionId: currentQuestion._id,
        userAnswer: newSelectedAnswers,
        testId,
      };

      console.log("userResponse", userResponse);

      // Make API call
      const response = await userApi.put(
        "/test/updateQuestionResponse",
        userResponse
      );

      // Ensure response structure is correct before updating
      const updatedResponse =
        response?.data?.updatedAnswer ?? structuredClone(newSelectedAnswers);

      // Dispatch updated user response
      dispatch(
        updateUserResponse({
          questionId: currentQuestion._id,
          userResponse: updatedResponse,
        })
      );
    } catch (error: any) {
      console.error(
        "Error sending response:",
        error?.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await userApi.get<{ questionsList: Question[] }>(
          "/test/getQuestions",
          {
            params: { testId },
          }
        );
        console.log("Successful API response:", response.data);
        const { questionsList } = response.data;
        dispatch(setQuestions(questionsList));
      } catch (error: any) {
        console.log(
          error.response?.data?.message || "Failed to fetch user information."
        );
      }
    };

    fetchQuestions();
  }, [testId]);

  return (
    <>
      <TestHeader currentIndex={index} totalQuestions={questions.length} />
      <div className="test-copy-disable" style={{ height: "100vh" }}>
        <div
          className={`question-container ${
            currentQuestion?.positioning === "left" ||
            currentQuestion?.positioning === "split"
              ? "left-positioning"
              : "center"
          }`}
        >
          {/* <div>
       <p>Test Started At: {testStartTime?.toLocaleTimeString() || "Not started"}</p>
      <p>Elapsed Time: {calculateTimeElapsed()}</p>
     </div> */}

          {currentQuestion ? (
            <>
              <div className="question-section">
                {/* {currentQuestion?.positioning === "split" && (
                  <Typography className="header-question-split">
                    Questions 1 to 3 are based on this passage.
                  </Typography>
                )} */}

                {currentQuestion?.positioning === "center" &&
                  (currentQuestion.optionType === "multiCorrectMCQ" ||
                    currentQuestion.optionType === "blank") && (
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        height: "auto",
                        backgroundColor: "#CFCFCF",
                        width: "100%",
                        textAlign: "center",
                        padding: "5px",
                        fontSize: "1rem",
                        // fontSize: { xs: "17px", sm: "20px" },
                        wordWrap: "break-word",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                        marginBottom: "20px",
                      }}
                    >
                      Consider each of the choices separately and select all
                      that apply.
                    </Typography>
                  )}
                <Stack direction="column" padding={"20px 0"}>
                  {currentQuestion.optionType === "selectSentence" ? (
                    <SelectSentence
                      questionId={currentQuestion.questionId}
                      options={currentQuestion.options}
                      sendUserResponse={(newSelectedAnswers: string[][]) =>
                        sendUserResponse(newSelectedAnswers)
                      }
                      userAnswer={currentQuestion.userAnswer || [[]]}
                      // Screenposition={currentQuestion.positioning}
                    />
                  ) : (
                    <div
                    className="question-html text-[1.25rem]"
                    
                  ><span className='mr-3 position:absolute;left:${
                    index + 1 > 9 ? "-42" : "-32"
                  }px;top:0'>Q-{index + 1}:</span>{currentQuestion.question}</div>
                  
                  )}
                </Stack>
              </div>

              <div className="options-section">
                {/* Render appropriate question type */}
                {/* {currentQuestion.optionType === "blank" && (
                  <VerbalQuestion
                    key={`${currentQuestion?.questionId}-${index}`}
                    questionId={currentQuestion.questionId}
                    options={currentQuestion.options}
                    userResponse={currentQuestion.userAnswer || [[]]}
                    onUserResponseUpdate={(newResponse) =>
                      sendUserResponse(newResponse)
                    }
                  />
                )} */}

                {currentQuestion.optionType === "twoCorrectMCQ" && (
                  <ExactlyMCQTwo
                    questionId={currentQuestion.questionId}
                    options={currentQuestion.options}
                    sendUserResponse={(newSelectedAnswers: string[][]) =>
                      sendUserResponse(newSelectedAnswers)
                    }
                    userAnswere={currentQuestion.userAnswer}
                  />
                )}

                {currentQuestion.optionType === "singleCorrectMCQ" && (
                  <MCQSingleAnswer
                    questionId={currentQuestion.questionId}
                    options={currentQuestion.options}
                    sendUserResponse={(newSelectedAnswers: string[][]) =>
                      sendUserResponse(newSelectedAnswers)
                    }
                    userAnswer={currentQuestion.userAnswer}
                  />
                )}

                {currentQuestion.optionType === "multiCorrectMCQ" && (
                  <MCQMultipleAnswer
                    questionId={currentQuestion.questionId}
                    options={currentQuestion.options}
                    sendUserResponse={(newSelectedAnswers: string[][]) =>
                      sendUserResponse(newSelectedAnswers)
                    }
                    userResponse={currentQuestion.userAnswer || [[]]}
                    Screenposition={currentQuestion.positioning}
                  />
                )}

                {currentQuestion.optionType === "selectSentence" && (
                  <div
                    className="question-html"
                    style={{ margin: "12px 0 0 48px" }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        `<span style='position:absolute;left:${
                          index + 1 > 9 ? "-42" : "-32"
                        }px;top:0'>Q-${index + 1}</span>` +
                          currentQuestion.question
                      ),
                    }}
                  />
                )}

                {currentQuestion.optionType === "numerical" && (
                  <input
                    type="text"
                    className="numerical-input"
                    value={selectedAnswers[0]?.[0] || ""}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const updatedAnswer = [[inputValue]];
                      setSelectedAnswers(updatedAnswer);
                    }}
                    onBlur={() => {
                      sendUserResponse(selectedAnswers);
                    }}
                    placeholder="Enter your answer here"
                  />
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default QuestionComponent;
