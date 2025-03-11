import React, { useEffect, useState } from "react";
import { Typography, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import {RootState } from "@/store/store";
import { selectQuestionSets } from "@/store/questionReducer";
// import Loader from "@/components/Loader";

interface HeaderProps {
  showHeader?: boolean;
}

const SectionInfo: React.FC<HeaderProps> = () => {
  const questions = useSelector((state: RootState) => state.question.questions);
  const questionSets = useSelector(selectQuestionSets);
  // const isLoading = useSelector((state: RootState) => state.question.isLoading);
  console.log("questionSets", questionSets);

  const sectionMap: Record<string, { title: string; sectionNumber: number,time:string }> = {
    VERBAL: { title: "Verbal Reasoning", sectionNumber: 1 ,time:"18 minutes"},
    QUANTITATIVE: { title: "Quantitative Reasoning", sectionNumber: 2 ,time:"21 minutes"},
    VERBAL_2: { title: "Verbal Reasoning", sectionNumber: 3,time:"23 minutes" },
    QUANTITATIVE_2: { title: "Quantitative Reasoning", sectionNumber: 4,time:"26 minutes" },
  };

  const [currentSection, setCurrentSection] = useState(() => ({
    title: "",
    sectionNumber: 0,
    time:"",
  }));

  useEffect(() => {
    if (questions.length > 0) {
      const sectionInfo = sectionMap[questions[0]?.section] || {
        title: "Test Completed",
        sectionNumber: 0,
      };
      setCurrentSection(sectionInfo);
    }
  }, [questions]);


  // if (isLoading) {
  //   return (
  //     <Loader/>
  //   );
  // }

  return (
    <>
      <div className="section">
        <Typography variant="h4" sx={{ textAlign: "start" }}>
          {currentSection.title}
          <Typography
            variant="h6"
            sx={{ marginBottom: "1rem", textAlign: "start" }}
          >
            {questions.length} Questions
          </Typography>
          <Typography
            variant="h6"
            sx={{ marginTop: "-1rem", textAlign: "start" }}
          >
           {currentSection.time} 
          </Typography>
        </Typography>
        <Divider /> <br />
        <Typography paragraph>
          For each question, indicate the best answer using the directions given. 
          If you need more detailed directions select <strong>Help</strong> at any time.
        </Typography>
        <Typography
          variant="h6"
          sx={{
            marginTop: "1.5rem",
            marginBottom: "1.5rem",
            textAlign: "start",
            fontSize: "1rem",
          }}
        >
          If the question has answer choices with <strong>Oval</strong> ⬭, then the correct answer consists 
          of a single choice. If the question has answer choices with <strong>square boxes</strong> □, 
          then the correct answer consists of one or more answer choices. Read the directions for each 
          question carefully. The directions will indicate if you should select one or more choices. 
          To answer questions based on a reading passage, you may need to scroll to read the entire passage. 
          You may also use your keyboard to navigate through the passage.
        </Typography>
        <br />
        <Typography paragraph>
          Select <strong>Continue</strong> to proceed.
        </Typography>
      </div>{" "}
    </>
  );
};

export default SectionInfo;
