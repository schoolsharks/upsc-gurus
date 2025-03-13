import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Checkbox,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";

import "./TestForm.css";
import userApi from "../../api/userApi";
import { TestType } from "../../types/enum";

function handleUrlPath() {
  const urlPath = window.location.pathname;

  if (urlPath.includes("sectional/launch-test")) {
    return TestType.SECTIONAL_TEST;
  } else {
    return TestType.FULL_LENGTH_TEST;
  }
}

const TestForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [testType, setTestType] = useState<TestType>(TestType.NULL);

  const { testTemplateId } = useParams();

  // Retrieve userId and accessToken from localStorage
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId || !accessToken) {
      console.error("User is not logged in");
      return;
    }

    const data = {
      firstName: firstName,
      lastName: lastName,
    };

    sessionStorage.setItem("test-taker-fn", data.firstName);
    sessionStorage.setItem("test-taker-ln", data.lastName);

    setLoading(true);
    try {
      const response = await userApi.post("/test/launchTest", {
        testTemplateId,
      });

      if (
        response.status === 201 ||
        response.status === 200 ||
        response.status === 204 ||
        response.status === 202
      ) {
        navigate(`/test/question/${response.data.testId}?question=0`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const testType = handleUrlPath();
    if (testType === TestType.FULL_LENGTH_TEST)
      setTestType(TestType.FULL_LENGTH_TEST);
    else if (testType === TestType.SECTIONAL_TEST)
      setTestType(TestType.SECTIONAL_TEST);
  }, [testType]);

  console.log("testType", testType);

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"12px 44px"}
      >
        <img
          src="/public/images/logo.png"
          alt="Upsc Gururs Logo"
          style={{ width: "170px" }}
        />
      </Stack>
      <div className="gradient-line"></div>

      {/* Form Container */}
      <form className="form-container" onSubmit={handleSubmit}>
        {/* <Typography variant="h4" component="h1" gutterBottom>
          POWERPREP™ Online
        </Typography> */}
        <Typography variant="h6" component="h2" gutterBottom>
          Choose your mode:
        </Typography>
        <p>Enter your first and last name in the following fields.</p>

        {/* Input Fields */}
        <Stack direction={"row"} marginTop={"20px"} gap={"20px"}>
          <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
            <Typography fontWeight={"600"}>First Name :</Typography>
            <TextField
              type="text"
              required
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              size="small" // This reduces the default height
              sx={{
                "& .MuiInputBase-root": {
                  height: "36px",
                },
                "& .MuiInputBase-input": {
                  padding: "8px",
                },
              }}
            />
          </Stack>

          <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
            <Typography fontWeight={"600"}>Last Name :</Typography>

            <TextField
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              size="small" // This reduces the default height
              sx={{
                "& .MuiInputBase-root": {
                  height: "36px",
                },
                "& .MuiInputBase-input": {
                  padding: "8px",
                },
              }}
            />
          </Stack>
        </Stack>

        <div className="flex gap-4 mt-5">
         {/* Submit Button */}
         <Button type="submit" variant="contained">
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "Start Test mode"
          )}
        </Button>
        <Button type="submit" variant="contained" disabled>
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "Learn Mode"
          )}
        </Button>
       </div>

        <hr />
        <p className="copytext">
          Copyright © 2025 by Upsc Gurus.All rights reserved.
        </p>
      </form>
    </>
  );
};

export default TestForm;
