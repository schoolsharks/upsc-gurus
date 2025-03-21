import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const AnalysisHeader = ({onDownloadAnalysis}:{onDownloadAnalysis?:()=>void}) => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const location = useLocation();
  
  // Determine which page we're on
  const isAnalysisPage = location.pathname.includes('/analysis');
  
  // Set dynamic text and navigation based on current page
  const pageTitle = isAnalysisPage ? "Test Analysis" : "Review Test";
  const buttonText = isAnalysisPage ? "Review Test" : "Back to Analysis";
  const navigateTo = isAnalysisPage 
    ? `/review-test/${testId}` 
    : `/analysis/${testId}`;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      paddingX={3}
      paddingY={2}
    >
      <Typography
        sx={{
          fontSize: "40px",
          letterSpacing: "2px",
        }}
      >
        {pageTitle}
      </Typography>
      <Box>
        <Button
          variant="outlined"
          sx={{ mr: 1 }}
          onClick={() => navigate(navigateTo)}
        >
          {buttonText}
        </Button>
       {onDownloadAnalysis && <Button variant="contained" color="primary" onClick={onDownloadAnalysis}  sx={{ mr: 1 }}>
          Download Analytics
        </Button>}
        <Button variant="outlined" color="primary"  onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default AnalysisHeader;