import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
  } from "@mui/material";
  import { TopicAnalysis } from "../../pages/analysis/Analysis";
  
  const TopicWiseAnalysis = ({ data }: { data: TopicAnalysis[] }) => {
    return (
      <TableContainer component={Paper} sx={{ mt: 5, p: 2, boxShadow: "none" }}>
        <Typography  align="center" sx={{ my:4 ,fontSize: "24px",fontWeight:"bolder" }}>
          Topic-wise Analysis
        </Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: "2px solid rgba(0, 0, 0, 0.2)" }}>
              <TableCell sx={{ fontSize: "20px", fontWeight: "bolder" }}>
                Topic
              </TableCell>
              <TableCell sx={{ fontSize: "20px", fontWeight: "bolder" }}>
                Total Questions
              </TableCell>
              <TableCell sx={{ fontSize: "20px", fontWeight: "bolder" }}>
                Correct
              </TableCell>
              <TableCell sx={{ fontSize: "20px", fontWeight: "bolder" }}>
                Incorrect
              </TableCell>
              <TableCell sx={{ fontSize: "20px", fontWeight: "bolder" }}>
                Not Attempted
              </TableCell>
              <TableCell sx={{ fontSize: "20px", fontWeight: "bolder" }}>
                Accuracy
              </TableCell>
              <TableCell sx={{ fontSize: "20px", fontWeight: "bolder" }}>
                Time Taken
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} sx={{ borderBottom: "none" }}>
                <TableCell sx={{ borderBottom: "none" }}>{row.topic}</TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  {row.totalQuestions}
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }}>{row.correct}</TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  {row.incorrect}
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  {row.notAttempted}
                </TableCell>
                <TableCell
                  sx={{ borderBottom: "none" }}
                >{`${row.accuracy}%`}</TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  {row.timeTaken}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  export default TopicWiseAnalysis;
  