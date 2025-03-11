
import { Typography, Divider } from "@mui/material";

import Header from "../../components/Header"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  showHeader?: boolean;
}
const SectionDirections: React.FC<HeaderProps> = ({showHeader=true}) => {
   const navigate = useNavigate()

  const handleNext = () => {
    console.log("Next button clicked");
    
   
  };

  const handleContinue = () => {
    const questionId = 1;
    navigate(`/test/analytical-writing/questions/${questionId}`);
   
  };

  const handleHelp = () => {
    navigate("/section/:section")
    
  };

  return (
    <>
      {showHeader &&  <Header
       onHelp={handleHelp}
        onNext={handleNext} 
        onContinue={handleContinue}
         sectionText="Section 1 of 3"
      />}
      <div className="section">
        <Typography variant="h4" sx={{ textAlign: "start" }}>
          Analytical Writing{" "}
        </Typography>

        <Divider />

        <Typography paragraph>
          This section consists of a timed Analyze an Issue writing task.
          Standard timing for this section is 30 minutes. The timer displays the
          time remaining for the task.
        </Typography>

        <Typography
          variant="h6"
          sx={{ marginTop: "1.5rem", textAlign: "start" }}
        >
          <strong>Important Notice</strong>
        </Typography>

        <Typography paragraph>
          Your essay response on the Analytical Writing section will be reviewed
          by ETS essay-similarity-detection software and by experienced essay
          readers during the scoring process.
        </Typography>

        <ul>
          <li>
            Text that is unusually similar to that found in one or more other
            test essay responses;
          </li>
          <li>
            Quoting or paraphrasing, without attribution, language that appears
            in published or unpublished sources; including sources from the
            Internet and/or sources provided by any third party;
          </li>
          <li>
            Unacknowledged use of work that has been produced through
            collaboration with others without citation of the contribution of
            others;
          </li>
          <li>
            Essays submitted as work of the test taker that appear to have been
            borrowed in whole or in part from elsewhere or prepared by another
            person.
          </li>
        </ul>

        <Typography
          variant="h6"
          sx={{ marginTop: "1.5rem", textAlign: "start",fontSize:"1rem" }}
        >
          When one or more of the preceding circumstances occurs, ETS may conclude, in its professional judgment, that the essay response does not reflect the independent writing skills that this test seeks to measure. When ETS reaches that conclusion, it cancels the Analytical Writing score, and because Analytical Writing scores are an integral part of the GRE General Test scores, those scores are canceled as well.
        </Typography> <br />


        <Typography paragraph>
          Select <strong>Continue</strong> to proceed.
        </Typography>
      </div>{" "}
    </>
  );
};

export default SectionDirections;
