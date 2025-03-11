import React, { useState, useEffect, useCallback } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import "./response.css";

interface MCQMultipleAnswerProps {
  questionId: string;
  options: string[][]; // Nested options
  sendUserResponse: (selectedAnswers: string[][]) => Promise<void>;
  userResponse: string[][];
  Screenposition: string;
}

const MCQMultipleAnswer: React.FC<MCQMultipleAnswerProps> = ({
  options,
  sendUserResponse,
  userResponse,
  Screenposition,
}) => {
  const [currentSelection, setCurrentSelection] = useState<string[][]>(
    userResponse || [[]]
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync local state with prop changes
  useEffect(() => {
    setCurrentSelection(userResponse || [[]]);
  }, [userResponse]);

  const handleCheckboxChange = useCallback(async (option: string, blankIndex: number) => {
    // Create a deep copy of current selection to avoid direct mutation
    const updatedSelection = currentSelection.map(group => [...group]);

    // Toggle the option for the given group
    if (updatedSelection[blankIndex]?.includes(option)) {
      // Remove the option
      updatedSelection[blankIndex] = updatedSelection[blankIndex].filter(
        (selected) => selected !== option
      );
    } else {
      // Add the option
      updatedSelection[blankIndex] = [
        ...(updatedSelection[blankIndex] || []),
        option,
      ];
    }

    // Optimistically update local state
    setCurrentSelection(updatedSelection);
    setIsUpdating(true);

    try {
      // Send the response
      await sendUserResponse(updatedSelection);
    } catch (error) {
      // If API call fails, revert to previous state
      setCurrentSelection(currentSelection);
      console.error("Error sending response:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [currentSelection, sendUserResponse]);

  return (
    <Grid item xs={12} md={4} >
      <Paper
        elevation={0}
        className={` ${Screenposition === "split" ? "split-layout" : "center-layout"
          }`}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap:"12rem"
        }}
      >
        <div>
          {Screenposition === "split" && (
            <Typography
              gutterBottom
              sx={{
                height: "auto",
                backgroundColor: "#CFCFCF",
                width: "100%",
                textAlign: "center",
                padding: "5px",
                wordWrap: "break-word",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
                marginBottom: "20px",
              }}
            >
              Consider each of the choices separately and select all that apply.
            </Typography>
          )}

          <div className="options-column">
            <div style={{ width: "100%" }} className="flex flex-col justify-center items-center w-full">
              {options.map((group, groupIndex) => (
                <div key={groupIndex} className="option-group">
                  {group.map((option, optionIndex) => (
                    <label
                      key={`${groupIndex}-${optionIndex}`}
                      className={`checkbox-label ${isUpdating ? "disabled" : ""
                        }`}
                    >
                      <input
                        type="checkbox"
                        value={option}
                        checked={
                          currentSelection[groupIndex]?.includes(option) || false
                        }
                        onChange={() => !isUpdating && handleCheckboxChange(option, groupIndex)}
                        disabled={isUpdating}
                      />
                      {/* <span className="custom-checkbox"></span> */}
                      {option}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-center">
          <p className="bottom-text-MCQ-Single">Select one or more answer choices.</p>
        </div>
      </Paper>
    </Grid>
  );
};

export default MCQMultipleAnswer;