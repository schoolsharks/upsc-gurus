import React, { useState, useEffect } from "react";
import "./verbal.css";


type VerbalQuestionProps = {
  questionId: string; // ID of the current question
  options: string[][]; // Options for each set of choices
  userResponse: string[][]; // Initial user response (from Redux/store)
  onUserResponseUpdate: (newResponse: string[][]) => void;  
};

const VerbalQuestion: React.FC<VerbalQuestionProps> = ({
  
  options,
  userResponse,
  onUserResponseUpdate,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[][]>(
    userResponse || [[]]
  );

  useEffect(() => {
    // Sync local state with userResponse from props
    setSelectedAnswers(userResponse);
  }, [userResponse]);

  const handleCheckboxChange = (option: string, blankIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[blankIndex] = [option];
    setSelectedAnswers(newSelectedAnswers);

    // Notify the parent of the updated response
    onUserResponseUpdate(newSelectedAnswers);
  };
    


    

  return (
    <div className="verbal-question-container">
      <div className="options-columns" >
        {options.map((blankOptions, blankIndex) => (
          <div key={blankIndex} className="options-column" style={{maxWidth:"320px"}} >
            <h3 style={{ marginLeft: "22px", marginBottom: "5px" }}>
              Blank ({blankIndex + 1})
            </h3>
            {blankOptions.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className={`option-label ${
                  selectedAnswers[blankIndex]?.[0] === option ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name={`blank-${blankIndex}`}
                  value={option}
                  checked={selectedAnswers[blankIndex]?.[0] === option}
                  onChange={() => handleCheckboxChange(option, blankIndex)}
                />
                {option}
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerbalQuestion;
