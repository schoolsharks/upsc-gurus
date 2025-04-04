import React, { useState, useEffect, useCallback } from "react";
import { Grid } from "@mui/material";
import "./mcqsingle.css";

interface MCQSingleAnswerProps {
  questionId: string;
  options: string[][];
  userAnswer?: string[][];
  sendUserResponse: (newSelectedAnswers: string[][]) => Promise<void>;
}

const MCQSingleAnswer: React.FC<MCQSingleAnswerProps> = ({
  questionId,
  options,
  userAnswer,
  sendUserResponse,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(userAnswer?.[0]?.[0] || "");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setSelectedOption(userAnswer?.[0]?.[0] || "");
  }, [userAnswer, questionId]);

  const onAnswerClick = useCallback(
    async (option: string) => {
      if (isUpdating) return; // Prevent multiple calls during update

      const newSelectedOption = selectedOption === option ? "" : option;
      setSelectedOption(newSelectedOption);
      setIsUpdating(true);

      try {
        await sendUserResponse(newSelectedOption ? [[newSelectedOption]] : [[]]);
      } catch (error) {
        console.error("Error sending response:", error);
        setSelectedOption(selectedOption); // Revert selection if API fails
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedOption, sendUserResponse, isUpdating]
  );

  return (
    <Grid item xs={12} display="flex" flexDirection="column" gap="12rem">
      <div className="single-correct-options">
        <div className="options-column-radio">
          {options.flat().map((option, index) => (
            <label
              key={index}
              className={`checkbox-label-radio ${selectedOption === option ? "selected" : ""} ${isUpdating ? "disabled" : ""}`}
            >
              <div className="radio-container" onClick={() => onAnswerClick(option)}>
                <input
                  type="radio"
                  value={option}
                  checked={selectedOption === option}
                  disabled={isUpdating}
                  readOnly
                />
                {option}
              </div>
            </label>
          ))}
        </div>
      </div>
      <div className="flex-center">
        <p className="bottom-text-MCQ-Single">Select one answer choice.</p>
      </div>
    </Grid>
  );
};

export default MCQSingleAnswer;
