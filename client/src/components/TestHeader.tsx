import { useNavigate, useLocation, useParams } from "react-router-dom";
import userApi from "../api/userApi";
import { markQuestion } from "../redux/reducers/questionReducer";
import { useDispatch } from "react-redux";

interface TestHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  questionId: string;
}

const TestHeader: React.FC<TestHeaderProps> = ({
  currentIndex,
  totalQuestions,
  questionId,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleNavigation = (direction: "next" | "prev") => {
    console.log(direction);
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
    <div className="flex justify-between items-center p-4 px-8  shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center">
        <img
          src="/images/logo.png"
          alt="UPSC Gurus Logo"
          className="logo mr-3"
        />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4 font-medium">
        <button
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
        </button>
        <button
          onClick={() => handleSubmit()}
          className="px-2 py-3 w-[200px] bg-[#039005] text-white rounded-lg cursor-pointer"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
};

export default TestHeader;
