import { Box, Card, CardContent, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material"

const QuestionCard = ({currentQuestion,currentIndex}:{currentQuestion:any,currentIndex:any}) => {
  return (
    
          <Card sx={{
            boxShadow:"none"
          }}>
            <CardContent>
              <Typography variant="h6" sx={{color:"#AEAFAE", textAlign:"start"}}>Question {currentIndex + 1}</Typography>
              <Typography dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
              <RadioGroup value={currentQuestion.userAnswer[0] || ""}>
                {currentQuestion.options.map((option:any, index:any) => (
                  <Box
                  display="flex"
                  alignItems="center"
                  border="1px solid black"
                  borderRadius="4px"
                  bgcolor="#f5f5f5"
                  padding="8px"
                  width="100%"
                  my={1}
                  >
                    <FormControlLabel key={index} value={option[0]} control={<Radio />} label={option[0]} disabled />
                  </Box>
                  
                ))}
              </RadioGroup>
              
              <Typography color="error">Incorrect Answer</Typography>
            </CardContent>
          </Card>
  )
}

export default QuestionCard