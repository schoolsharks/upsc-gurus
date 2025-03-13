import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  // CardContent,
  // CardActions,
  Box,
  Stack,
  // IconButton,
  Dialog,
  useTheme,
  // IconButton,
} from "@mui/material";
import "./home.css"; 
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { logout, setUserInfo } from "../../redux/reducers/userReducer";
import { MdLogout } from "react-icons/md";
import { convertSecondsToTime } from '../../utils/formatTime'
import userApi from "../../api/userApi";
// import { paymentGateway } from "@/libs/paymentGateway";

const Home: React.FC = () => {
  // const [userInfo, setUserInfo] = useState<User | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [inProgressDialogOpen, setInProgressDialogOpen] = useState(false);
  const { completedTests, inProgressTests, unAttemptedTests } = useSelector(
    (state: RootState) => state.user
  );
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const cardStyles = {
    flex: "1",
    border: "1px solid #00000033",
    borderRadius: "20px",
    minWidth: "280px",
    maxWidth: "300px",
    minHeight: "200px",
    padding: "20px",
    boxShadow: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", 
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userApi.get(`/test/userTestInfo`);
        dispatch(setUserInfo(response.data.user));
      } catch (err: any) {
        dispatch(setUserInfo(err));
        console.log(
          err.response?.data?.message || "Failed to fetch user information."
        );
      }
    };

   fetchUserInfo()
  }, []);

  const testData = {
    testName: "GRE Practice Test 1",
    totalTime: "1 hour and 28 minutes",
    subjects: ["Verbal Reasoning", "Quantitative Reasoning"],
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
  };
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"16px 44px"}
      >
        <img
          src="/images/logo.png"
          alt="Career Geek Logo"
          style={{ width: "170px" }}
        />
        <Button
          endIcon={<MdLogout />}
          onClick={() => setLogoutDialogOpen(true)}
          sx={{
            color: "#FF3D3D",
            height: "max-content",
            textTransform: "none",
          }}
        >
          Log Out
        </Button>
      </Stack>
      <div className="gradient-line"></div>

      <Box
        className="dashboard"
        sx={{ [theme.breakpoints.down("sm")]: { padding: 0 } }}
      >
        {/* Header Section */}
        {/* <header className="header">
          <div>
            <Typography variant="h4" component="h2">
              Welcome!
            </Typography>
            <Typography variant="body1">{email}</Typography>
          </div>
        </header> */}

        {/* All Tests */}
        <section className="test-section">
          <Typography
            sx={{ fontSize: "1.25rem", fontWeight: "600" }}
            variant="h5"
          >
            All Tests
          </Typography>
          <Stack direction={"row"} gap={"1rem"} flexWrap={"wrap"} marginTop={"14px"}>
            
            {inProgressTests?.length ? (
              inProgressTests?.map((test: any,index) => (
                <Card key={index}
                  sx={cardStyles}
                >
                  <Stack>
                    <Typography
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "400",
                      }}
                    >
                      {test.testName ?? testData.testName}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: "#656565", marginBottom: "12px" }}
                    >
                      <span style={{ color: "green" }}>●</span> Started on{" "}
                      {new Date(test.startDate || "").toLocaleDateString()}
                    </Typography>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography fontSize={"0.9rem"}>Time Spent:</Typography>
                      <Typography fontSize={"0.9rem"}>
                        {/* {(test.testTimeSpent/60).toFixed(2)  || "N/A"} */}
                        {`${convertSecondsToTime(test.testTimeSpent)} minutes`}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography fontSize={"0.9rem"}>
                        Completion Status:
                      </Typography>
                      <Typography fontSize={"0.9rem"}>
                        {test?.testCompletionPercent?.toFixed(2)}% completed
                      </Typography>
                    </Stack>
                    <Box textAlign="center">
                      <Button
                        onClick={() => navigate(`/test/question/${test.testId}`)}
                        variant="contained"
                        style={{
                          marginTop: "16px",
                          backgroundColor: "black",
                          color: "white",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          width: "100%",
                        }}
                      >
                        Resume Test
                      </Button>
                    </Box>
                  </Stack>
                </Card>
              ))
            ) : (
              <Typography>No Tests available</Typography>
            )}
          {unAttemptedTests?.length ? (
  unAttemptedTests?.map((test: any, index) => (
    <Card
      key={index}
      sx={{
        ...cardStyles,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Stack sx={{ flexGrow: 1 }}> {/* Allows the content to fill available space */}
        <Typography
          style={{
            fontSize: "1.25rem",
            fontWeight: "400",
          }}
        >
          {test.testName}
        </Typography>
        <Typography
          variant="body2"
          style={{ color: "#656565", marginBottom: "12px" }}
        >
          <span style={{ color: "#D5D5D5" }}>●</span> Total Time {testData.totalTime}
        </Typography>
      </Stack>
      <Box textAlign="center">
        <Button
          onClick={() => navigate(`/launch-test/${test?.testTemplateId}`)}
          variant="contained"
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            width: "100%",
          }}
        >
          Begin Test
        </Button>
      </Box>
    </Card>
  ))
) : (
  <Typography>Soon new test will be added.</Typography>
)}

          </Stack>
        </section>

        {/* Unattempted Tests */}
        {/* <section className="test-section">
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            All Tests
          </Typography>
          <Stack direction={"row"} flexWrap={"wrap"} gap={"1rem"} marginTop={"14px"}>
           
          </Stack>
        </section> */}

        {/* Completed Tests */}
        <section>
          <Typography
            sx={{
              marginBottom: "10px",
              fontSize: "1.25rem",
              fontWeight: "600",
            }}
          >
            Previous Attempts
          </Typography>
          {completedTests.length ? (
            <Stack direction={"row"} gap={"1rem"} flexWrap={"wrap"}>
              {completedTests.map((test,index) => (
                <Card key={index}
                  sx={{
                    border: "1px solid #00000033",
                    borderRadius: "20px",
                    // width: "100%",
                    minWidth: "357px",
                    maxWidth: "425px",
                    flex: "1",
                    padding: "20px",
                    boxShadow: "none",
                  }}
                >
                  <Stack>
                    <Stack direction={"row"}>
                      <Typography fontSize={"1.25rem"} fontWeight={600}>
                        {test.testName}
                      </Typography>
                    </Stack>
                    <Typography>
                      <span style={{ color: "#7AE69E" }}>●</span> Completed on :{" "}
                      {new Date(test.completeDate || "").toLocaleDateString()}
                    </Typography>
                  </Stack>
                  <Stack marginTop={"20px"} gap="8px">
                    {/* <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography>Quantitative Reasoning</Typography>
                      <Typography>
                        {test.quantitativeScore ?? 130}/{170}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography>Verbal Reasoning</Typography>
                      <Typography>
                        {test.verbalScore ?? 130}/{170}
                      </Typography>
                    </Stack> */}
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography fontWeight={"600"}>Total</Typography>
                      <Typography fontWeight={"600"}>
                        {test?.totalScore}/{200}
                      </Typography>
                    </Stack>
                  </Stack>
                  {/* <Typography
                    sx={{
                      textDecoration: "underline",
                      color: "#142E79",
                      cursor: "pointer",
                      marginTop: "20px",
                    }}
                    onClick={() => navigate(`/analysis/${test.testId}`)}
                  >
                    View Report Card
                  </Typography> */}
                </Card>
              ))}
            </Stack>
          ) : (
            <Typography>No completed tests.</Typography>
          )}
        </section>
      </Box>

      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <Stack sx={{ padding: "2rem", maxWidth: "400px" }}>
          <Typography fontSize="1.5rem" fontWeight={"600"}>
            Confirm Logout
          </Typography>
          <Typography fontSize="1rem" color={theme.palette.text.secondary}>
            Are you sure you want to log out? You will not be able to login
            again without credentials
          </Typography>
          <Stack
            direction={"row"}
            // justifyContent="space-between"
            gap={"1rem"}
            flex="1"
            marginTop={"1rem"}
          >
            <Button
              variant="outlined"
              onClick={() => setLogoutDialogOpen(false)}
              sx={{ borderRadius: "50px", border:"1px solid black", color:"black" }}
            >
              No
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: "50px",background:"black" }}
              onClick={handleLogout}
            >
              Yes
            </Button>
          </Stack>
        </Stack>
      </Dialog>

      <Dialog
        open={inProgressDialogOpen}
        onClose={() => setInProgressDialogOpen(false)}
      >
        <Stack sx={{ padding: "2rem", maxWidth: "400px" }}>
          <Typography fontSize="1.5rem" fontWeight={"600"}>
            Test in Progress
          </Typography>
          <Typography fontSize="1rem" color={theme.palette.text.secondary}>
            You have an ongoing test. Please complete it before starting another one.
          </Typography>
          <Stack
            direction={"row"}
            gap={"1rem"}
            flex="1"
            marginTop={"1rem"}
          >
            <Button
              variant="outlined"
              onClick={() => setInProgressDialogOpen(false)}
              sx={{ borderRadius: "50px" }}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default Home;
