import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';

interface SelectSentenceProps {
  questionId: string;
  options: string[][];
  userAnswer?: string[][];
  sendUserResponse: (newSelectedAnswers: string[][]) => Promise<void>;
}

const SelectSentence: React.FC<SelectSentenceProps> = ({
  questionId,
  options,
  userAnswer,
  sendUserResponse,
}) => {
  // Flatten the options array to handle nested arrays
  const flattenedOptions = options.flat();

  const [selectedOption, setSelectedOption] = useState<string>(
    userAnswer?.[0]?.[0] || ""
  );
  // const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setSelectedOption(userAnswer?.[0]?.[0] || "");
  }, [userAnswer, questionId]);

  const onAnswerClick = useCallback(
    async (option: string) => {
      const newSelectedOption = selectedOption === option ? "" : option;
      setSelectedOption(newSelectedOption);
      // setIsUpdating(true);

      try {
        await sendUserResponse(
          newSelectedOption ? [[newSelectedOption]] : [[]]
        );
      } catch (error) {
        setSelectedOption(selectedOption);
        console.error("Error sending response:", error);
      } finally {
        // setIsUpdating(false);
      }
    },
    [selectedOption, sendUserResponse]
  );

  return (
    <Box 
      // direction="row" 
      // flexWrap="wrap" 
      gap={1} 
      // alignItems="center" 
      sx={{ cursor: 'pointer',height:"80vh" }}
    >
      {flattenedOptions.map((option, index) => (
        <span
          key={index}
          onClick={() => onAnswerClick(option)}
          style={{
            padding: '4px 8px',
            // margin: '2px',
            backgroundColor: selectedOption === option ? '#fdff32' : 'transparent',
            color: selectedOption === option ? '#000000' : '#000000',
            // borderRadius: '4px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            display:"inline",
          }}
        >
          {option}
        </span>
      ))}
    </Box>
  );
};

export default SelectSentence;