import { Box, Stack, Chip } from "@mui/material";
import React from "react";
import { Question } from "../types/QuestionType";
import { useNavigate } from "react-router-dom";

interface TestSidebarProps {
  questions: Question[];
}

const sidebarBottom = [
  { label: "Answered", bgColor: "#000000", borderColor: "" },
  { label: "Not Answered", bgColor: "", borderColor: "#FB3030" },
  { label: "Marked For Review", bgColor: "", borderColor: "#FFBD00" },
  { label: "Not Visited", bgColor: "", borderColor: "#AFAFAF" },
];

const TestSidebar: React.FC<TestSidebarProps> = ({ questions }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-[#F8F8F8] border border-[#ccc] h-screen items-center pt-4">
      <div className="flex flex-col gap-2 font-semibold mb-8">
        <div className="tracking-wider">TIME LEFT</div>
      </div>
      <div className="flex gap-2 text-[1.25rem]">
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
            flexWrap: "wrap", // Ensures multiple Chips wrap properly
            justifyContent: "center", // Centers Chips inside the Box
            alignItems: "center",
            height: "65vh",
            msOverflowY:"scroll"
          }}
        >
          {questions.map((question, index) => {
            let chipStyles = {};
            let textColor = "#000";
            let bgColor = "transparent";
            let borderColor = "transparent";

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
                textColor = "#FB3030";
                borderColor = "#FB3030";
                break;
              default:
                textColor = "#AFAFAF";
                borderColor = "#AFAFAF";
            }

            chipStyles = {
              color: textColor,
              backgroundColor: bgColor,
              border:
                borderColor !== "transparent"
                  ? `1px solid ${borderColor}`
                  : "none",
              width: "45px",
              height: "32px",
              fontSize: "1rem",
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
                  border: `1px solid ${item.borderColor} `,
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

export default TestSidebar;
