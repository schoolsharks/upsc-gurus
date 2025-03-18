import { Box, Button, FormControl, MenuItem, Select, Typography } from "@mui/material";

const AnalysisHeader = () => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>

      <Box display="flex">
      <Typography sx={{display:"flex" ,alignItems:"center",mr:1}}>Choose Test Attempt - </Typography>
      <FormControl size="small">
        <Select defaultValue="Attempt 4 - 14 Sept 2024">
          <MenuItem value="Attempt 4 - 14 Sept 2024">Attempt 4 - 14 Sept 2024</MenuItem>
          <MenuItem value="Attempt 3 - 10 Aug 2024">Attempt 3 - 10 Aug 2024</MenuItem>
        </Select>
      </FormControl>
      </Box>
      <Typography sx={{
        fontSize:"40px",
        letterSpacing:"2px",
      }} >
        Test Analysis
      </Typography>
      <Box>
        <Button variant="outlined" sx={{ mr: 1 }}>
          Review Test
        </Button>
        <Button variant="contained" color="primary">
          Download Analytics
        </Button>
      </Box>
    </Box>
  );
};

export default AnalysisHeader;
