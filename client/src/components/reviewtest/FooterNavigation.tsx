import { Box, Button } from '@mui/material';

const FooterNavigation = ({ setCurrentIndex, currentIndex, total }:{ setCurrentIndex:any, currentIndex:any, total:any }) => {
  return (
    <Box display="flex" justifyContent="space-between" mt={2}>
        <Button disabled={currentIndex === 0} onClick={() => setCurrentIndex((prev:any) => prev - 1)}
          sx={{textTransform:"none"}}
          >
          ← Previous Question
        </Button>
        <Button disabled={currentIndex === total - 1} onClick={() => setCurrentIndex((prev:any) => prev + 1)}
          sx={{textTransform:"none"}}
          >
          Next Question →
        </Button>
      </Box>
  )
}

export default FooterNavigation;