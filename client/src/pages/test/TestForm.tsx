import { useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Button, Stack, CircularProgress } from "@mui/material";

import "./TestForm.css";
import userApi from "../../api/userApi";

const TestForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<"TEST" | "LEARN">("TEST");

  const { testTemplateId } = useParams();

  // Retrieve userId and accessToken from localStorage
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  // Handle form submission
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    selectedMode: "TEST" | "LEARN"
  ) => {
    e.preventDefault();

    if (!userId || !accessToken) {
      console.error("User is not logged in");
      return;
    }

    setLoading(true);
    setMode(selectedMode);

    try {
      const response = await userApi.post("/test/launchTest", {
        testTemplateId,
        mode: selectedMode,
      });

      if ([200, 201, 202, 204].includes(response.status)) {
        if (selectedMode === "TEST") {
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
      <form
        className="form-container px-8"
        onSubmit={(e) => handleSubmit(e, mode)}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Choose your mode:
        </Typography>

        <div className="flex gap-4 mt-5 flex-col sm:flex-row">
          {/* Start Test Mode Button */}
          <Button
            type="button"
            variant="contained"
            onClick={(e) =>
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>, "TEST")
            }
          >
            {loading && mode === "TEST" ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Test mode"
            )}
          </Button>

          {/* Learn Mode Button */}
          <Button
            type="button"
            variant="contained"
            onClick={(e) =>
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>, "LEARN")
            }
          >
            {loading && mode === "LEARN" ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Learning Mode"
            )}
          </Button>
        </div>

        <hr />
        <p className="copytext">
          Copyright © 2025 by Upsc Gurus. All rights reserved.
        </p>
      </form>
    </>
  );
};

export default TestForm;
