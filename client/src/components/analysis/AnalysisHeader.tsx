import { useState } from "react";
import { 
  Box, 
  Button, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem 
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const AnalysisHeader = ({ onDownloadAnalysis }: { onDownloadAnalysis?: () => void }) => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const location = useLocation();

  const isAnalysisPage = location.pathname.includes("/analysis");
  const pageTitle = isAnalysisPage ? "Test Analysis" : "Review Test";
  const buttonText = isAnalysisPage ? "Review Test" : "Back to Analysis";
  const navigateTo = isAnalysisPage ? `/review-test/${testId}` : `/analysis/${testId}`;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
          fontSize: { xs: "24px", md: "40px" },
          letterSpacing: "2px",
        }}
      >
        {pageTitle}
      </Typography>
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <Button variant="outlined" sx={{ mr: 1 }} onClick={() => navigate(navigateTo)}>
          {buttonText}
        </Button>
        {onDownloadAnalysis && (
          <Button variant="contained" color="primary" onClick={onDownloadAnalysis} sx={{ mr: 1 }}>
            Download Analytics
          </Button>
        )}
        <Button variant="outlined" color="primary" onClick={() => navigate("/")}>Back to Home</Button>
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <IconButton onClick={handleMenuOpen}>
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => { navigate(navigateTo); handleMenuClose(); }}>{buttonText}</MenuItem>
          {onDownloadAnalysis && (
            <MenuItem onClick={() => { onDownloadAnalysis(); handleMenuClose(); }}>Download Analytics</MenuItem>
          )}
          <MenuItem onClick={() => { navigate("/"); handleMenuClose(); }}>Back to Home</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default AnalysisHeader;