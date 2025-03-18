import { Box, Paper, Typography } from "@mui/material"
import { UserTypes } from "../../pages/analysis/Analysis"

const UserInfo = ({user}:{user:UserTypes}) => {
  return (

    <Paper elevation={2} sx={{ p: 3, my: 5,bgcolor:"#F4F5F5",boxShadow:"none",borderRadius:"13px" }}>
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography>
            <strong>Name:</strong> {user.name}
          </Typography>
          <Typography>
            <strong>Email Id:</strong> {user.email}
          </Typography>
        </Box>
        <Box>
          <Typography>
            <strong>Test Attempt:</strong> {user.testAttempt}
          </Typography>
          <Typography>
            <strong>Total Time Taken:</strong> {user.timeTaken} hrs
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default UserInfo