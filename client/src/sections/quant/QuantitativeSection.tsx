import React from "react";
import { Typography, Divider } from "@mui/material";
import { RootState, AppDispatch } from '../../store/store';
import Header from "@/components/Header"; // Ensure this path is correct
import { useNavigate } from "react-router-dom"
import  {fetchQuestions} from "../../store/questionReducer"
import { useDispatch, useSelector } from "react-redux";

interface HeaderProps {
  showHeader?: boolean;
}
const QuantitativeSection: React.FC<HeaderProps> = ({showHeader=true}) => {
   const navigate = useNavigate()
   const dispatch = useDispatch<AppDispatch>();

   const questions = useSelector((state: RootState) => state.question.questions);

  let setName: string|null = questions[0]?.section ?? '0';

  // useEffect(() => {
  //   dispatch(fetchQuestions());
  //   setName = questions[0]?.section;
  // }, [dispatch]);


  // console.log("setName",setName, questions[0]?.section);


  const handleNext = () => {
    console.log("Next button clicked");
    
   
  };

  const handleContinue = ()=> {
    dispatch(fetchQuestions());
    navigate("/question?=0")

   
  }

  const handleHelp = () => {
    navigate(`/section/${setName}`)
    
  };

  return (
    <>
      {showHeader &&  <Header
       onHelp={handleHelp}
        onNext={handleNext} 
        onContinue={handleContinue}
         sectionText={
          setName === "VERBAL"
            ? `Section ${1} of 4`
            : setName === "QUANTITATIVE"
            ? `Section ${2} of 4`
            : setName === "VERBAL_2"
            ? `Section ${3} of 4`
            : setName === "QUANTITATIVE_2"
            ? `Section ${4} of 4`
            : `Test completed`
        }
      />}
      <div className="section">
        <Typography variant="h4" sx={{ textAlign: "start" }}>
        Quantitative Reasoning{" "}
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
            21 minutes
          </Typography>
        </Typography>

        <Divider />

        <Typography paragraph>
          
For each question, indicate the best answer, using the directions given. If you need more detailed directions, select Help at any time.
        </Typography>

        <Typography
           variant="h6"
          sx={{ marginTop: "1.5rem",marginBottom: "1.5rem", textAlign: "start" , fontSize:"1rem"}}
        >
          <strong>An on-screen calculator is available for each question in this section. To use the calculator, select the calculator button.</strong>
        </Typography>

        <Typography paragraph>
        If the question has answer choices with <strong>Oval</strong> ⬭, then the correct answer consists of a single choice. If the question has answer choices with <strong>square boxes</strong> □, then the correct answer consists of one or more answer choices. Read the directions for each question carefully. The directions will indicate if you should select one or more answer choices. To answer questions based on a data presentation, you may need to scroll or use your keyboard to access the entire presentation.

        </Typography> <br />


        <p>All numbers used are real numbers.</p><br />
        <p>All figures are assumed to lie in a plane unless otherwise indicated..</p><br />

        <Typography variant="h6" sx={{textAlign:"start", fontSize:"1rem"}}>Geometric figures, such as lines, circles, triangles, and quadrilaterals, are not necessarily drawn to scale. That is, you should not assume that quantities such as lengths and angle measures are as they appear in a figure. You should assume, however, that lines shown as straight are actually straight, points on a line are in the order shown, and more generally, all geometric objects are in the relative positions shown. For questions with geometric figures, you should base your answers on geometric reasoning, not on estimating or comparing quantities by sight or by measurement.</Typography><br />

        <Typography variant="h6" sx={{textAlign:"start", fontSize:"1rem"}}>Coordinate systems, such as xy-planes and number lines, are drawn to scale; therefore you can read, estimate, or compare quantities in such figures by sight or by measurement.</Typography> <br />


        <Typography variant="h6" sx={{textAlign:"start", fontSize:"1rem"}}>Graphical data representation, such as bar graphs, circle graphs, and line graphs, are drawn to scale; therefore, you can read, estimate, or compare data values by sight or measurement.</Typography>



        <Typography paragraph>
          Select <strong>Continue</strong> to proceed.
        </Typography>
      </div>{" "}
    </>
  );
};

export default QuantitativeSection;
