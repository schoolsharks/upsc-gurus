import { useNavigate, useLocation, useParams } from "react-router-dom";
import userApi from "../api/userApi";
import { markQuestion } from "../redux/reducers/questionReducer";
import { useDispatch } from "react-redux";
import { Button, Dialog, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
// import { MdMenu } from "react-icons/md";
// import { RxCross1 } from "react-icons/rx";

interface TestBottomProps {
  currentIndex: number;
  totalQuestions: number;
  questionId: string;
}

const TestBottom: React.FC<TestBottomProps> = ({
  currentIndex,
  totalQuestions,
  questionId,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const handleNavigation = (direction: "next" | "prev") => {
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < totalQuestions) {
      navigate(`${location.pathname}?question=${newIndex}`);
    }
  };
  const { testId } = useParams();

  const handleMark = async () => {
    try {
      const response = await userApi.put("/test/markForReview", {
        questionId,
        testId,
      });
      console.log("markResponse", response);
      dispatch(markQuestion({ questionId, questionStatus: "MARKED" }));
    } catch (error: any) {
      console.log("Error marking question for review:", error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await userApi.put("/test/lockTest", {
        testId,
      });
      console.log("submitResponse", response);
      navigate("/");
    } catch (error: any) {
      console.log("Error Submitting Test", error.message);
    }
  };

  return (
    <div className="flex justify-between items-center md:hidden mb-5 -mt-20">
      <div className="flex items-center gap-3 w-full">
        <div className="flex md:hidden items-center gap-4 font-medium flex-col w-full">
          <div className="flex gap-2"><button
            onClick={() => handleNavigation("prev")}
            disabled={currentIndex === 0}
            className="w-[85px] px-2 py-3 bg-[#D1D1D1] text-black rounded-lg disabled:hidden cursor-pointer"
          >
            Previous
          </button>
          <button
            onClick={() => handleMark()}
            className="px-2 py-3 bg-[#FFBD00] text-black rounded-lg cursor-pointer"
          >
            Mark for Review
          </button>
          <button
            onClick={() => handleNavigation("next")}
            disabled={currentIndex === totalQuestions - 1}
            className="w-[85px] px-2 py-3 bg-[#2E2E2E] text-white rounded-lg disabled:hidden cursor-pointer"
          >
            Next
          </button></div>
          <button
            onClick={() => setSubmitDialogOpen(true)}
            className="px-2 py-3 w-[200px] bg-[#039005] text-white rounded-lg cursor-pointer"
          >
            Submit Test
          </button>
        </div>

        <Dialog
          open={submitDialogOpen}
          onClose={() => setSubmitDialogOpen(false)}
        >
          <Stack sx={{ padding: "2rem", maxWidth: "400px" }}>
            <Typography fontSize="1.5rem" fontWeight={"600"}>
              Confirm Submission
            </Typography>
            <Typography fontSize="1rem" color={theme.palette.text.secondary}>
              Are you sure you submit the test?
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
                onClick={() => setSubmitDialogOpen(false)}
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
                onClick={handleSubmit}
              >
                Yes
              </Button>
            </Stack>
          </Stack>
        </Dialog>
      </div>
    </div>
  );
};

export default TestBottom;
