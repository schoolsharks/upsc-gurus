import { Box, Paper, Typography } from "@mui/material";
import { UserTypes } from "../../pages/analysis/Analysis";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import theme from "../../theme";

const UserInfo = ({ user }: { user: UserTypes }) => {
  const { email } = useSelector((state: RootState) => state.user);
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        my: 5,
        bgcolor: "#F4F5F5",
        boxShadow: "none",
        borderRadius: "13px",
      }}
    >
      <Box display="flex" sx={{[theme.breakpoints.down("sm")]:{flexDirection:"column",gap:"12px"}}} justifyContent="space-between">
        <Box>
          <Typography>
            <strong>Email Id:</strong> {email}
          </Typography>
        </Box>
        <Box>
          <Typography>
            <strong>Total Time Taken:</strong> {user.timeTaken}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserInfo;
