import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  Box,
  Stack,
  Dialog,
  useTheme,
} from "@mui/material";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { logout, setUserInfo } from "../../redux/reducers/userReducer";
import { MdLogout } from "react-icons/md";
import { convertSecondsToTime } from "../../utils/formatTime";
import userApi from "../../api/userApi";
import { LockOutlined } from "@mui/icons-material";


const tests=["Polity","Geography","Art and Culture","Environment","Economics","Science and IR","GS Full Syllabus Test","Full GS","Full CSAT test"]

const Home: React.FC = () => {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [inProgressDialogOpen, setInProgressDialogOpen] = useState(false);
  const { completedTests, inProgressTests,allTests } = useSelector(
    (state: RootState) => state.user
  );
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const cardStyles = {
    flex: "1",
    border: "1px solid #00000033",
    borderRadius: "20px",
    minWidth: "310px",
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
        console.log(response.data)
        dispatch(setUserInfo(response.data.user));
      } catch (err: any) {
        dispatch(setUserInfo(err));
        console.log(
          err.response?.data?.message || "Failed to fetch user information."
        );
      }
    };

    fetchUserInfo();
  }, []);

  const testData = {
    testName: "GRE Practice Test 1",
    totalTime: "2 hours",
    subjects: ["Verbal Reasoning", "Quantitative Reasoning"],
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
  };

  const handleResumeTest = (testMode: string, testId: string) => {
    if (testMode === "TEST") {
      navigate(`/test/question/${testId}`);
    }
    else {
      navigate(`/learn/test/question/${testId}`);
    }
  };
  
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"16px 44px"}
      >
        <button onClick={() => navigate("/")} className="focus:outline-none">
          <img
            src="/images/logo.png"
            alt="UPSC Gurus Logo"
            className="logo cursor-pointer"
          />
        </button>
      <Stack direction={"row"} gap={"16px"}>
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
        {/* <Button
          variant="outlined"
        >
          +91 0123456789
        </Button>
        <Button
          variant="outlined"
        >
          +91 0123456789
        </Button> */}
      </Stack>
      </Stack>
      <div className="gradient-line"></div>

      <Box
        className="dashboard"
        sx={{ [theme.breakpoints.down("sm")]: { padding: 0 } }}
      >
        <Typography
              sx={{ fontSize: "1.25rem", fontWeight: "600" }}
              variant="h5"
              className="text-center md:text-left"
            >
              All Tests
            </Typography>
        {/* In Progress Tests Section */}
        {inProgressTests.length > 0 && (
          <section className="test-section mb-8">
            <Typography
              sx={{ fontSize: "1.25rem", fontWeight: "600" }}
              variant="h5"
              className="text-center md:text-left"
            >
              In Progress Tests
            </Typography>
            <Stack
              direction={"row"}
              gap={"1rem"}
              flexWrap={"wrap"}
              marginTop={"14px"}
              sx={{
                justifyContent: { xs: "center", sm: "start" },
              }}
            >
              {inProgressTests?.map((test: any, index) => (
                <Card key={index} sx={cardStyles}>
                  <Stack>
                    <Stack direction="row" justifyContent={"space-between"}>
                      <Typography
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "400",
                        }}
                      >
                        {test.testName ?? testData.testName}
                      </Typography>
                      <Box
                        bgcolor={"#03900547"}
                        sx={{
                          fontSize: "12px",
                          padding: "2px 8px",
                          fontWeight: "600",
                          borderRadius: "12px",
                          height: "fit-content",
                          color: "#039005",
                        }}
                      >
                        In Progress
                      </Box>
                    </Stack>
                    <Stack direction="row" justifyContent={"space-between"}>
                      <Typography
                        variant="body2"
                        style={{ color: "#656565", marginBottom: "12px" }}
                      >
                        <span style={{ color: "green" }}>●</span> Started on{" "}
                        {new Date(test.startDate || "").toLocaleDateString()}
                      </Typography>
                      <Box
                        bgcolor={"white"}
                        sx={{
                          fontSize: "12px",
                          padding: "2px 8px",
                          fontWeight: "600",
                          borderRadius: "12px",
                          height: "fit-content",
                          color: "#FFBD00",
                        }}
                      >
                        {test.testMode === "TEST" ? "Test Mode" : "Learning Mode"}
                      </Box>
                    </Stack>
                    
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography fontSize={"0.9rem"}>Time Spent:</Typography>
                      <Typography fontSize={"0.9rem"}>
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
                        onClick={() =>
                          handleResumeTest(test.testMode, test.testId)
                        }
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
              ))}
            </Stack>
          </section>
        )}

        {/* Start New Test Section */}
        {allTests.length > 0 && (
          <section className="test-section mb-8">
            <Typography
              sx={{ fontSize: "1.25rem", fontWeight: "600" }}
              variant="h5"
              className="text-center md:text-left"
            >
              Start New Test
            </Typography>
            <Stack
              direction={"row"}
              gap={"1rem"}
              flexWrap={"wrap"}
              marginTop={"14px"}
              sx={{
                justifyContent: { xs: "center", sm: "start" },
              }}
            >
              {allTests?.map((test: any, index) => (
                <Card
                  key={index}
                  sx={{
                    ...cardStyles,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack sx={{ flexGrow: 1 }}>
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
                      <span style={{ color: "#D5D5D5" }}>●</span> Total Time{" "}
                      {testData.totalTime}
                    </Typography>
                  </Stack>
                  <Box textAlign="center">
                    <Button
                      onClick={() =>
                        navigate(`/launch-test/${test?.testTemplateId}`)
                      }
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
              ))}


              {/* Static temporary data */}
              {
                tests.map((test,index)=>(<Card
                  key={index}
                  sx={{
                    ...cardStyles,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack sx={{ flexGrow: 1 }}>
                    <Typography
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "400",
                      }}
                    >
                      {test}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: "#656565", marginBottom: "12px" }}
                    >
                      <span style={{ color: "#D5D5D5" }}>●</span> Total Time{" "}
                      2 hours
                    </Typography>
                  </Stack>
                  <Box textAlign="center">
                    <Button
                      disabled={true}
                      variant="contained"
                      startIcon={<LockOutlined/>}
                      sx={{
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        width: "100%",
                      }}
                    >
                      Unlock on 27/03/2025
                    </Button>
                  </Box>
                </Card>))
              }
            </Stack>
          </section>
        )}


        {/* Completed Tests Section */}
        <section className="mb-8">
          <Typography
            sx={{
              marginBottom: "10px",
              fontSize: "1.25rem",
              fontWeight: "600",
            }}
            className="text-center md:text-left"
          >
            Previous Attempts
          </Typography>
          {completedTests.length ? (
            <Stack
              direction={"row"}
              gap={"1rem"}
              flexWrap={"wrap"}
              sx={{
                justifyContent: { xs: "center", sm: "start" },
              }}
            >
              {completedTests.map((test, index) => (
                <Card
                  key={index}
                  sx={{
                    border: "1px solid #00000033",
                    borderRadius: "20px",
                    minWidth: "330px",
                    maxWidth: "400px",
                    flex: "1",
                    padding: "20px",
                    boxShadow: "none",
                  }}
                  className="cursor-pointer"
                  onClick={() => navigate(`/analysis/${test.testId}`)}
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
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography fontWeight={"600"}>Total</Typography>
                      <Typography fontWeight={"600"}>
                        {(test?.totalScore ?? 0).toFixed(2)}/{200}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography
                    sx={{
                      textDecoration: "underline",
                      color: "#142E79",
                      cursor: "pointer",
                      marginTop: "20px",
                    }}
                    onClick={() => navigate(`/analysis/${test.testId}`)}
                  >
                    View Report Card
                  </Typography>
                </Card>
              ))}
            </Stack>
          ) : (
            <Typography>No completed tests.</Typography>
          )}
        </section>
      </Box>

      {/* Dialogs */}
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
            gap={"1rem"}
            flex="1"
            marginTop={"1rem"}
          >
            <Button
              variant="outlined"
              onClick={() => setLogoutDialogOpen(false)}
              sx={{
                borderRadius: "50px",
                border: "1px solid black",
                color: "black",
              }}
            >
              No
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: "50px", background: "black" }}
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
            You have an ongoing test. Please complete it before starting another
            one.
          </Typography>
          <Stack direction={"row"} gap={"1rem"} flex="1" marginTop={"1rem"}>
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