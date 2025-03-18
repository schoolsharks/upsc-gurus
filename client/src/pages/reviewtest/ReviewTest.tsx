import { useState } from "react";
import { Container, Box, } from "@mui/material";
import ReviewTestHeader from "../../components/reviewtest/ReviewTestHeader";
import QuestionCard from "../../components/reviewtest/QuestionCard";
import FooterNavigation from "../../components/reviewtest/FooterNavigation";
import QuestionsGrid from "../../components/reviewtest/QuestionsGrid";

export const data = {
    "success": true,
    "questionsList": {
      "timeLimit": 5280,
      "timeSpent": 42,
      "timeRemaining": 5238,
      "questionDetails": [
        {
          "questionId": "67d15392245afa3edde813bb",
          "question": "Consider the following pairs of ancient texts and their descriptions: <br/>Netti Pakarana – Buddhist treatise on logic,<br/> Parishishtaparvan – Jain text narrating Chandragupta Maurya’s conversion,<br/> Avadana Shataka – Collection of Buddhist morality tales,<br/> Trishashti Lakshana Mahapurana – Shaiva text detailing temple architecture.<br/> How many of the above pairs are correctly matched?",
          "options": [["Only one"], ["Only two"], ["Only three"], ["None"]],
          "optionType": "singleCorrectMCQ",
          "questionStatus": "SEEN",
          "userAnswer": [["Only one"]]
        },
        {
          "questionId": "67d15392245afa3edde813bc",
          "question": "With reference to ancient India, which of the following statements regarding taxation is correct?",
          "options": [
            [
              "The Mitakshara system recognized property taxation while Dayabhaga did not."
            ],
            [
              "The Arthashastra mentions Nishka as a major silver coin used for tax payments."
            ],
            ["The Dharma Sutras classify taxes as ‘Rajabhaga’ and ‘Bali’."],
            [
              "The Mauryan state imposed a fixed tax rate of 1/4th of agricultural produce."
            ]
          ],
          "optionType": "singleCorrectMCQ",
          "questionStatus": "SEEN",
          "userAnswer": [["The Mitakshara system recognized property taxation while Dayabhaga did not."]]
        },
        ],
    }
}

const ReviewTest = () => {
  const { questionDetails } = data?.questionsList;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questionDetails[currentIndex];

  return (
    <Container maxWidth="lg">
      <ReviewTestHeader />
      <Box display="flex" mt={4}>
      <Box flex={3} p={2}>
        <QuestionCard currentIndex={currentIndex}  currentQuestion={currentQuestion}/>
        <FooterNavigation setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} total={questionDetails.length} />
        </Box>
        <Box flex={1}>
          <QuestionsGrid questions={questionDetails} setCurrentIndex={setCurrentIndex} />
        </Box>
      </Box>
    </Container>
  );
};

export default ReviewTest;
