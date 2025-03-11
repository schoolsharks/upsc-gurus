import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import {
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import "../styles/HeaderStyles.css";

import { selectQuestionSets, updateTimeRemaining } from "../redux/reducers/questionReducer";
import { useDispatch, useSelector } from "react-redux";
import { AddCircleOutlineOutlined, EqualizerOutlined, RemoveCircleOutline } from "@mui/icons-material";
import { AppDispatch } from "../redux/store";

interface HeaderProps {
  onContinue?: () => void;
  onReturn?: () => void;
  onNext?: () => void;
  onHelp?: () => void;
  onBack?: () => void;
  onReview?: () => void;
  onGoToAnalysis?:()=>void;
  isMarked?: boolean;
  onMark?: (questionId: string) => void;
  questionId?: string;

  onExitsection?: () => void;
  onCalculatorOpen?: () => void;
  sectionText?: string;
  isDisable?: boolean;
  showTimer?:boolean;
}

const Header: React.FC<HeaderProps> = ({
  onContinue,
  onReturn,
  onNext,
  onBack,
  onGoToAnalysis,
  isDisable,
  showTimer=true,
}) => {
  // const questions = useSelector(selectQuestions);
  const questionSets = useSelector(selectQuestionSets);
  const timeRemaining = questionSets[0]?.timeRemaining;



  const dispatch=useDispatch<AppDispatch>()
  const [showTime, setShowTime] = useState(true);
  const [timeui, setTimeui] = useState(false);

  useEffect(() => {
    if (timeRemaining > 0 && showTimer) {
      setTimeui(true);
    }
  }, [timeRemaining, showTimer]);

  useEffect(() => {
    if (timeRemaining <= 0 || !showTimer) return;
  
    const timer = setInterval(() => {
      dispatch(updateTimeRemaining(1)); 
    }, 1000);
  
    return () => clearInterval(timer);
  }, [timeRemaining, showTimer, dispatch]);


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <>
      <div className="header-container">
        {/* Logo */}
        <div className="logo-container">
          <img
            src="/public/images/logo.jpeg"
            alt="UPSC Gurus Logo"
            className="logo mr-3"
          />
          <Typography fontSize={"1.25rem"} color={"#ffffff"}>Test Preview Tool</Typography>
        </div>

        {/* Navigation text and buttons */}
        <div className="navtext-button-container">

          {onReturn && (
            <Button
              variant="contained"
              // sx={{ backgroundColor: "#424242" }}
              onClick={onReturn}
              className="buttons"
            >
              Return
              <FaArrowLeft style={{ marginTop: "5px" }} />{" "}
            </Button>
          )}
          {onGoToAnalysis && (
            <Button
              variant="contained"
              // sx={{ backgroundColor: "#424242" }}
              onClick={onGoToAnalysis}
              className="buttons"
            >
              Analysis
              <EqualizerOutlined/>
            </Button>
          )}

          {onBack && (
            <Button
              variant="contained"
              onClick={!isDisable ? onBack : undefined}
              disabled={isDisable}
              style={{
                color: "white",
                backgroundColor: "#142E79",
                opacity: isDisable ? 0.8 : 1,
                height: "100%",
                cursor: isDisable ? "not-allowed" : "pointer",
                gap: "10px",
              }}
              className="buttons"
            >
              Back
              <FaArrowLeft style={{ marginTop: "5px" }} />{" "}
            </Button>
          )}

          {onNext && (
            <Button
              variant="contained"
              className="buttons"
              onClick={!isDisable ? onNext : undefined}
              disabled={isDisable}
              style={{
                color: "white",
                backgroundColor: "#142E79",
                opacity: isDisable ? 0.8 : 1,
                height: "100%",
                cursor: isDisable ? "not-allowed" : "pointer",
                gap: "10px",
              }}
            >
              Next
              <FaArrowRight width={"30px"} />
            </Button>
          )}

          {onContinue && (
            <Button
              variant="contained"
              onClick={onContinue}
              className="buttons"
              sx={{ backgroundColor: "#142E79" }}
            >
              Continue
              <FaArrowRight style={{ marginLeft: "8px" }} />
            </Button>
          )}
        </div>
      </div>
      <div className="gradient-line" style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}}>
        
          {/* Section Info */}
           {/* <span
            style={{
              marginLeft: "30px",
              marginTop: "7px",
              display: "inline-block",
            }}
          >
            {sectionText}
          </span> */}

          {/* Timer UI */}
          {timeui && (
            <div
              className="timer-display"
              style={{ display: "flex", alignItems: "center" }}
            >
              {showTime && (
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginRight: "10px",
                    color: "#000",
                  }}
                >
                  {formatTime(timeRemaining)}
                </span>
              )}
              <button
                className="toggle-button"
                onClick={() => setShowTime((prev) => !prev)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "14px",
                  color: "#888",
                  cursor: "pointer",
                  marginRight: "20px",
                }}
              >
                {showTime?<AddCircleOutlineOutlined/>:<RemoveCircleOutline/>}
                {showTime ? "Hide time" : "Show time"}
              </button>
            </div>
          )}
        </div>
    </>
  );
};

export default Header;
