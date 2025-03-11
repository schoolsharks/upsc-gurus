import { Typography } from "@mui/material";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

interface TestHeaderProps {
  currentIndex: number;
  totalQuestions: number;
}

const TestHeader: React.FC<TestHeaderProps> = ({ currentIndex, totalQuestions }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (direction: "next" | "prev") => {
    console.log(direction);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < totalQuestions) {
      navigate(`${location.pathname}?question=${newIndex}`);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-black border-b">
      {/* Logo Section */}
      <div className="flex items-center">
        <img
          src="/images/logo.jpeg"
          alt="UPSC Gurus Logo"
          className="logo mr-3"
        />
        <Typography fontSize="1.25rem" color="#000" component="span">
          Test Preview Tool
        </Typography>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4 font-semibold">
        <button
          onClick={() => handleNavigation("prev")}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:hidden cursor-pointer"
        >
          <span className="flex flex-row-reverse items-center gap-2">Previous <FaArrowLeft/></span>
        </button>

        <span className="text-sm font-medium text-white">
          Question: {currentIndex + 1}/{totalQuestions}
        </span>

        <button
          onClick={() => handleNavigation("next")}
          disabled={currentIndex === totalQuestions - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:hidden cursor-pointer"
        >
          <span className="flex items-center gap-2">Next <FaArrowRight/></span>
        </button>
      </div>
    </div>
  );
};

export default TestHeader;
