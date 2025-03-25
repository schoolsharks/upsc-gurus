import React, { useMemo } from "react";
import { Box, Button, Card, Stack, Typography, useTheme } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { convertSecondsToTime } from "../../utils/formatTime";
import { useNavigate } from "react-router-dom";
import { TestTypes } from "../../redux/reducers/userReducer";

interface DashboardContentProps {
  testType: TestTypes;
  inProgressTests: any[];
  allTests: any[];
  completedTests: any[];
  handleResumeTest: (testMode: string, testId: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  testType,
  inProgressTests,
  allTests,
  completedTests,
  handleResumeTest,
}) => {
  const pyqs = [
    { name: "PYQs - 2020" ,date:null},
    { name: "PYQs - 2019" ,date:null},
    { name: "PYQs - 2018" ,date:null},
    { name: "PYQs - 2017" ,date:null},
    { name: "PYQs - 2016" ,date:null},
    { name: "PYQs - 2015" ,date:null},
    { name: "PYQs - 2014" ,date:null},
  ];
  const tests = useMemo(
    () =>
      [
        {
          name: "Polity",
          date: "27/03/2025",
        },
        {
          name: "History",
          date: "01/04/2025",
        },
        {
          name: "Geography",
          date: "06/04/2025",
        },
        {
          name: "Art and Culture",
          date: "11/04/2025",
        },
        {
          name: "Environment",
          date: "16/04/2025",
        },
        {
          name: "Economics",
          date: "21/04/2025",
        },
        {
          name: "Science and IR",
          date: "26/04/2025",
        },
        {
          name: "GS Full Syllabus Test",
          date: "01/05/2025",
        },
        {
          name: "Full GS Test",
          date: "06/05/2025",
        },
        {
          name: "Full GS CSAT",
          date: "06/05/2025",
        },
      ].filter((item) => !allTests.find((test) => test.testName === item.name)),
    [allTests]
  );

  const theme = useTheme();
  const navigate = useNavigate();

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

  return (
    <Box
      sx={{
        p: 3,
        mt: 4,
        flexGrow: 1,
        [theme.breakpoints.down("sm")]: { p: 0 },
      }}
    >
      {/* In Progress Tests Section */}
      {inProgressTests?.filter((item) => item.testType === testType).length >
        0 && (
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
            {inProgressTests
              ?.filter((item) => item.testType === testType)
              ?.map((test: any, index) => (
                <Card key={index} sx={cardStyles}>
                  <Stack>
                    <Stack direction="row" justifyContent={"space-between"}>
                      <Typography
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "400",
                        }}
                      >
                        {test.testName}
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
                        {test.testMode === "TEST"
                          ? "Test Mode"
                          : "Learning Mode"}
                      </Box>
                    </Stack>

                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography fontSize={"0.9rem"}>Time Spent:</Typography>
                      <Typography fontSize={"0.9rem"}>
                        {convertSecondsToTime(test.testTimeSpent)} minutes
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
                        disabled={test.unlockUrl != null}
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
      {allTests?.filter((item) => item.testType === testType).length > 0 && (
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
            {allTests
              ?.filter((item) => item.testType === testType)
              ?.sort((a, b) => b.testName.localeCompare(a.testName))
              ?.map((test: any, index) => (
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
                      <span style={{ color: "#D5D5D5" }}>●</span> Total Time : 2
                      hours
                      {/* {test.totalTime} */}
                    </Typography>
                  </Stack>
                  <Box textAlign="center">
                    <Button
                      onClick={() =>
                        test.unlockUrl
                          ? window.open(test.unlockUrl)
                          : navigate(`/launch-test/${test?.testTemplateId}`)
                      }
                      variant="contained"
                      startIcon={test.unlockUrl ? <LockOutlined /> : null}
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        width: "100%",
                      }}
                    >
                      {test.unlockUrl ? "Get Access" : "Begin Test"}
                    </Button>
                  </Box>
                </Card>
              ))}

            {/* Temp tests */}
            {(testType === "TEST_SERIES" ? tests : pyqs)?.map((test, index) => (
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
                    {test.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: "#656565", marginBottom: "12px" }}
                  >
                    <span style={{ color: "#D5D5D5" }}>●</span> Total Time : 2
                    hours
                  </Typography>
                </Stack>
                <Box textAlign="center">
                  <Button
                    variant="contained"
                    disabled={true}
                    startIcon={<LockOutlined />}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      width: "100%",
                    }}
                  >
                    {test.date ? `Unlock on ${test.date}` : "Coming Soon"}
                  </Button>
                </Box>
              </Card>
            ))}
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
        {completedTests?.filter((item) => item.testType === testType).length ? (
          <Stack
            direction={"row"}
            gap={"1rem"}
            flexWrap={"wrap"}
            sx={{
              justifyContent: { xs: "center", sm: "start" },
            }}
          >
            {completedTests
              ?.filter((item) => item.testType === testType)
              ?.map((test, index) => (
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
  );
};

export default DashboardContent;
