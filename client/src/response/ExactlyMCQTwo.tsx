import React, { useEffect, useState } from "react";
import '../sections/verbal/verbal.css';
import { Grid, Paper} from '@mui/material';

interface ExactlyMCQTwoProps {
  questionId: string;
  options: string[][];
  sendUserResponse: (newSelectedAnswers: string[][]) => void;
  userAnswere?: string[][];
}

const ExactlyMCQTwo: React.FC<ExactlyMCQTwoProps> = ({
  options,
  sendUserResponse,
  userAnswere,
}) => {
  const [localSelectedAnswers, setLocalSelectedAnswers] = useState<string[][]>(
    userAnswere || []
  );

  useEffect(() => {
    userAnswere && setLocalSelectedAnswers(userAnswere)
  }, [userAnswere])

  const handleCheckboxChange = (option: string, groupIndex: number) => {
    console.log("1")
    const newSelectedAnswers = localSelectedAnswers ? [...localSelectedAnswers] : [];
    const currentGroupAnswers = newSelectedAnswers[groupIndex] || [];

    if (currentGroupAnswers.includes(option)) {
      // Deselect option
      newSelectedAnswers[groupIndex] = currentGroupAnswers.filter(
        (answer) => answer !== option
      );
    } else if (currentGroupAnswers.length < 2) {
      // Select option only if fewer than 2 answers are selected
      newSelectedAnswers[groupIndex] = [...currentGroupAnswers, option];
    }

    setLocalSelectedAnswers(newSelectedAnswers);

    // Call API to sync answers
    sendUserResponse(newSelectedAnswers);
  };

  return (
    <Grid item xs={12} md={6} padding={"12px"}>
      <Paper elevation={0} className="paper-container"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12rem"
        }}
      >

        {/* <Typography variant="body1" paragraph sx={{textAlign:"justify"}}>
          The passage addresses which of the following issues related to Glass's use of popular elements in his classical compositions?
        </Typography> */}


        <div className="options-column">
          {options.map((optionGroup, groupIndex) => (
            <div key={groupIndex}>

              {optionGroup.map((option, optionIndex) => (
                <label key={optionIndex} className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={
                      (localSelectedAnswers && localSelectedAnswers[groupIndex]?.includes(option)) || false
                    }
                    onChange={() => handleCheckboxChange(option, groupIndex)}
                  />

                  {option}
                </label>
              ))}
            </div>
          ))}
        </div>

        <div className="flex-center">
          <p className="bottom-text-MCQ-Single">Select two answer choices.</p>
        </div>
      </Paper>
    </Grid>
  );
};

export default ExactlyMCQTwo;
