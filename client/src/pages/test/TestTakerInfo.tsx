import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { TestType } from "../../types/enum";
interface TesttoolProps {
  showTool?: boolean;
}

function handleUrlPath() {
  const urlPath = window.location.pathname;

  if (urlPath.includes("sectional/confirmation")) {
    return TestType.SECTIONAL_TEST;
  } else {
    return TestType.FULL_LENGTH_TEST;
  }
}

const TestTakerInfo: React.FC<TesttoolProps> = ({ showTool }) => {
  const navigate = useNavigate();
  // const {userId}=useSelector((state:RootState)=>state.user)
  const [testType, setTestType] = useState<TestType>(TestType.NULL);

  const firstName = sessionStorage.getItem("test-taker-fn");
  const lastName = sessionStorage.getItem("test-taker-ln");

  useEffect(() => {
    const testType = handleUrlPath();
    if (testType) {
      setTestType(testType);
    }
  }, []);

  const { testTemplateId } = useParams();
  return (
    <>
      {!showTool && <Header />}

      {showTool ? (
        <Box sx={{ marginLeft: "50px", width: "90vw", marginTop: "56px" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Testing Tool
          </Typography>
          <Divider />
          <Box sx={{ width: "65vw", gap: "20px", marginTop: "20px" }}>
            <Button variant="contained">Next</Button>
            <span style={{ marginLeft: "20px" }}>
              After you answer a question, select <b>Next</b>. You may still
              return to the question and change your answer after selecting{" "}
              <b>Next</b>.
            </span>
            <br />
            <Divider sx={{ margin: "20px" }} />
            <Button variant="contained">Help</Button>
            <span style={{ marginLeft: "20px" }}>
              By selecting <b>Help</b> you can get information on different
              topics. The topics are presented on different tabs. You are now in{" "}
              <b>Help</b>.
            </span>
          </Box>
          <Typography variant="body1" gutterBottom>
            Select <b>Return</b> to go on.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            width: "60%",
            marginLeft: "50px",
            padding: "20px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Test Taker Information
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please check the following information, if this is correct, select
            Continue. If this is incorrect, select Exit.
          </Typography>

          <Card sx={{ margin: "20px 0" }}>
            <CardContent>
              <Typography variant="body1">
                Test:{" "}
                {testType === TestType.FULL_LENGTH_TEST
                  ? "GRE Practice Test 1"
                  : "Sectional Practice Test"}
              </Typography>
              {firstName && lastName && (
                <Typography variant="body1">
                  Name: {firstName + " " + lastName || "N/A"}
                </Typography>
              )}
              {/* <Typography variant="body1">Test Taker ID: {userId || "N/A"}</Typography> */}
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: "20px",
              gap: "20px",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                if (testType === TestType.FULL_LENGTH_TEST) {
                  navigate("/user-info");
                } else {
                  navigate("/user-info/sectional-dashboard");
                }
              }}
            >
              Exit
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (testType === TestType.FULL_LENGTH_TEST) {
                  navigate(`/test/question/${testTemplateId}`);
                } else {
                  navigate("/sectional/onboarding");
                }
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default TestTakerInfo;
