import { Box, Stack, Chip } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Question } from "../redux/reducers/testAnalysisReducer";

interface ReviewTestSidebarProps {
  questions: Question[];
}

const sidebarBottom = [
  { label: "Correct", bgColor: "#039005", borderColor: "" },
  { label: "Incorrect", bgColor: "#FB3030", borderColor: "" },
  { label: "Not Answered", bgColor: "", borderColor: "#AFAFAF" },
  { label: "Marked For Review", bgColor: "#FFBD00", borderColor: "" },
];

const ReviewTestSidebar: React.FC<ReviewTestSidebarProps> = ({ questions }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-[#F6F6F6] h-full items-center pt-4">
      <div className="text-left gap-1 font-medium mb-4 sm:mb-2 text-2xl">
        Questions
      </div>
      <div className="flex gap-2 sm:text-[1.25rem] mb-2">
        <span>Questions: {questions.length}</span>|
        <span>
          Answered:{" "}
          {questions.filter((q) => q.questionStatus === "ATTEMPTED").length}
        </span>
      </div>
      <Stack>
        <Box
          sx={{
            borderRadius: 2,
            p: 2,
            overflowY: "auto",
            backgroundColor: "#F8F8F8",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            height: "65vh",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {questions.map((question, index) => {
            let chipStyles = {};
            let textColor = "#000";
            let bgColor = "transparent";
            let borderColor = "transparent";

            if (question.userAnswer && question.userAnswer.length > 0) {
              if (question.isCorrect === true) {
                // Correct answer
                textColor = "#fff";
                bgColor = "#4CAF50"; // Green
                borderColor = "transparent";
              } else if (question.isCorrect === false) {
                // Incorrect answer
                textColor = "#fff";
                bgColor = "#F44336"; // Red
                borderColor = "transparent";
              }
            } else {
              // If not answered, use the original status styling
              switch (question.questionStatus) {
                case "ATTEMPTED":
                  textColor = "#fff";
                  bgColor = "#111111";
                  break;
                case "MARKED":
                  textColor = "#FFBD00";
                  borderColor = "#FFBD00";
                  break;
                case "SEEN":
                  textColor = "";
                  borderColor = "";
                  break;
                default:
                  textColor = "#AFAFAF";
                  borderColor = "#AFAFAF";
              }
            }

            // Special case: always show marked questions as yellow regardless of answer status
            if (question.questionStatus === "MARKED") {
              textColor = "#FFBD00";
              borderColor = "#FFBD00";
              bgColor = "transparent";
            }

            chipStyles = {
              color: textColor,
              backgroundColor: bgColor,
              border:
                borderColor !== "transparent"
                  ? `1px solid ${borderColor}`
                  : "none",
              width: { xs: "35px", sm: "40px", md: "45px" },
              height: { xs: "25px", sm: "28px", md: "32px" },
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              margin: "4px",
            };

            return (
              <Chip
                key={question.questionId}
                label={index + 1}
                size="small"
                onClick={() =>
                  navigate(`${location.pathname}?question=${index}`)
                }
                sx={chipStyles}
              />
            );
          })}
        </Box>
      </Stack>

      <div className="my-5">
        <div className="flex flex-col gap-2">
          {sidebarBottom.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: item.bgColor,
                  border: item.borderColor
                    ? `1px solid ${item.borderColor}`
                    : "none",
                }}
              ></div>
              <div>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewTestSidebar;
