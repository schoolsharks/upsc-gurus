import { useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Button,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";

import "./TestForm.css";
import userApi from "../../api/userApi";

const TestForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<"test" | "learn">("test"); // Track selected mode

  const { testTemplateId } = useParams();

  // Retrieve userId and accessToken from localStorage
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>, selectedMode: "test" | "learn") => {
    e.preventDefault();

    if (!userId || !accessToken) {
      console.error("User is not logged in");
      return;
    }

    const data = {
      firstName,
      lastName,
    };

    sessionStorage.setItem("test-taker-fn", data.firstName);
    sessionStorage.setItem("test-taker-ln", data.lastName);

    setLoading(true);
    setMode(selectedMode);

    try {
      const response = await userApi.post("/test/launchTest", {
        testTemplateId,
      });

      if ([200, 201, 202, 204].includes(response.status)) {
        if (selectedMode === "test") {
          navigate(`/test/question/${response.data.testId}?question=0`);
        } else {
          navigate(`/learn/test/question/${response.data.testId}?question=0`);
        }
      }
    } catch (error) {
      console.error("Error sending data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"12px 16px"}
      >
        <button onClick={() => navigate("/")} className="focus:outline-none">
          <img
            src="/images/logo.png"
            alt="UPSC Gurus Logo"
            className="logo cursor-pointer"
          />
        </button>
      </Stack>
      <div className="gradient-line"></div>

      {/* Form Container */}
      <form className="form-container px-8" onSubmit={(e) => handleSubmit(e, mode)}>
        <Typography variant="h6" component="h2" gutterBottom>
          Choose your mode:
        </Typography>
        <p>Enter your first and last name in the following fields.</p>

        {/* Input Fields */}
        <Stack direction={{ xs: "column", sm: "row" }} marginTop={"20px"} gap={"20px"}>
          <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
            <Typography fontWeight={"600"}>First Name :</Typography>
            <TextField
              type="text"
              required
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              size="small"
              sx={{
                "& .MuiInputBase-root": { height: "36px" },
                "& .MuiInputBase-input": { padding: "8px" },
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
              size="small"
              sx={{
                "& .MuiInputBase-root": { height: "36px" },
                "& .MuiInputBase-input": { padding: "8px" },
              }}
            />
          </Stack>
        </Stack>

        <div className="flex gap-4 mt-5 flex-col sm:flex-row">
          {/* Start Test Mode Button */}
          <Button
            type="button"
            variant="contained"
            onClick={(e) => handleSubmit(e as unknown as FormEvent<HTMLFormElement>, "test")}
          >
            {loading && mode === "test" ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Start Test mode"
            )}
          </Button>

          {/* Learn Mode Button */}
          <Button
            type="button"
            variant="contained"
            onClick={(e) => handleSubmit(e as unknown as FormEvent<HTMLFormElement>, "learn")}
          >
            {loading && mode === "learn" ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Learn Mode"
            )}
          </Button>
        </div>

        <hr />
        <p className="copytext">Copyright © 2025 by Upsc Gurus. All rights reserved.</p>
      </form>
    </>
  );
};

export default TestForm;
