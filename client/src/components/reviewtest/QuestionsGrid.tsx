import { Box, Button, Typography } from "@mui/material"

const QuestionsGrid = ({ questions, setCurrentIndex }:{questions:any, setCurrentIndex:any}) => {
  return (
    <Box p={2}
    sx={{
      bgcolor:"#F6F7F7",
      minHeight:"100vh"
    }}
    >
      <Typography sx={{fontWeight : "bolder"}}>Questions</Typography>
      <Typography sx={{mb:2}}>Questions: {questions.length} | Answered :</Typography>
      <Box display="grid" gridTemplateColumns="repeat(10, 1fr)" gap={1}>
        {questions.map((q:any, index:any) => (
         <Button
         key={index}
         variant="contained"
         color={q.userAnswer.length > 0 ? (q.userAnswer[0] === q.correctAnswer ? "success" : "error") : "warning"}
         onClick={() => setCurrentIndex(index)}
         sx={{
           minWidth: 40, 
           width: 40, 
           height: 40, 
           borderRadius: "50%", 
           padding: 0, 
           display: "flex", 
           alignItems: "center", 
           justifyContent: "center"
         }}
       >
         {index + 1}
       </Button>
       
        ))}
      </Box>
    </Box>
  )
}

export default QuestionsGrid