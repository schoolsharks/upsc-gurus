import { useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Button, Stack, CircularProgress } from "@mui/material";
import logo from "../../assets/logo.webp"
import "./TestForm.css";
import userApi from "../../api/userApi";

const TestForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<"TEST" | "LEARN">("TEST");

  const { testTemplateId } = useParams();

  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

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
            src={logo}
            alt="UPSC Gurus Logo"
            className="logo cursor-pointer"
          />
        </button>
      </Stack>
      <div className="gradient-line"></div>

      <form
        className="form-container px-8"
        onSubmit={(e) => handleSubmit(e, mode)}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Choose your mode:
        </Typography>

        <div className="flex gap-4 mt-5 flex-col sm:flex-row">
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
              "Test Mode"
            )}
          </Button>

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

        <hr className="mt-5" />

        <Typography variant="h5" gutterBottom>
          Test Instructions
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to the UPSC Gurus Test Platform. Please read the following instructions carefully before proceeding.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>1. Test Modes:</strong>
          <ul>
            <li><strong>Learn Mode:</strong> You will receive immediate feedback on each question, including the correct answer and explanation.</li>
            <li><strong>Test Mode:</strong> You must complete the entire test before reviewing the correct answers and explanations in the analysis section.</li>
          </ul>
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>2. Navigation:</strong>
          <ul>
            <li>Use the <strong>Next</strong> button to move to the next question.</li>
            <li>Use the <strong>Previous</strong> button to go back to the previous question.</li>
            <li>Click <strong>Mark for Review</strong> to flag a question for later reference.</li>
            <li>Use the sidebar to directly navigate to any question.</li>
          </ul>
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>3. Submitting the Test:</strong>
          <ul>
            <li>Click <strong>Submit</strong> to end the test. A confirmation prompt will appear before final submission.</li>
            <li>Once submitted, you cannot modify your answers.</li>
          </ul>
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>4. Resuming an In-Progress Test:</strong>
          <ul>
            <li>If you leave the test without submitting, your progress will be saved.</li>
            <li>You can resume your test anytime from the <strong>In-Progress Tests</strong> section.</li>
          </ul>
        </Typography>
        <Typography variant="body1" paragraph>
          Please ensure you have a stable internet connection before starting. Good luck!
        </Typography>
        
        <p className="copytext">Copyright © 2025 by UPSC Gurus. All rights reserved.</p>
      </form>
    </>
  );
};

export default TestForm;
