import React, { useState } from "react";
import { Button, Divider } from "@mui/material";
import "./SentenceSelectionResp.css"; // Importing the CSS file for styles
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface HeaderProps {
  showHeader?: boolean;
}

const AnalyticalSection: React.FC<HeaderProps>= ({showHeader=true}) => {
  const [text, setText] = useState("");
  const [clipboard, setClipboard] = useState(""); 
  const [history, setHistory] = useState<string[]>([]); 
  const [redoStack, setRedoStack] = useState<string[]>([]); 
  const [activeButton, setActiveButton] = useState<string>("cut");
   
  const navigate = useNavigate()


  const handleContinue = ()=>{
   
    navigate("/test/verbal-writing/questions/:questionId");
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHistory([...history, text]);
    setText(e.target.value);
    setRedoStack([]);
  };

  const handleCut = () => {
    if (text.length > 0) {
      setClipboard(text);
      setHistory([...history, text]);
      setText("");
      setRedoStack([]);
      setActiveButton("cut");
    }
  };

  const handlePaste = () => {
    if (clipboard.length > 0) {
      setHistory([...history, text]);
      setText(clipboard);
      setRedoStack([]);
      setActiveButton("paste");
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setRedoStack([text, ...redoStack]);
      setText(previousState);
      setHistory(history.slice(0, history.length - 1));
      setActiveButton("undo");
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setHistory([...history, text]);
      setText(nextState);
      setRedoStack(redoStack.slice(1));
      setActiveButton("redo");
    }
  };

  return (
    <>
     {showHeader &&  <Header
        onContinue={handleContinue}
        sectionText="Section 1 of 3 | Question 1" 
      />}
    <div className="analytical-section-container">
      {/* Left panel */}
      <div className="left-panel">
        <p>As people rely more and more on technology to solve problems, the ability of humans to think for themselves will surely deteriorate.</p>
        <Divider/>
        <p>Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.</p>
      </div>

      {/* Right panel */}
      <div className="right-panel">
        <div className="button-container">
          <Button
            variant="contained"
            onClick={handleCut}
            disabled={!text}
            className={activeButton === "cut" ? "active" : ""}
          >
            Cut
          </Button>
          <Button
            variant="contained"
            onClick={handlePaste}
            disabled={!clipboard}
            className={activeButton === "paste" ? "active" : ""}
          >
            Paste
          </Button>
          <Button
            variant="contained"
            onClick={handleUndo}
            disabled={history.length === 0}
            className={activeButton === "undo" ? "active" : ""}
          >
            Undo
          </Button>
          <Button
            variant="contained"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className={activeButton === "redo" ? "active" : ""}
          >
            Redo
          </Button>
        </div>
        <textarea
          className="editable-textarea"
          value={text}
          onChange={handleChange}
          placeholder="Type something here..."
        />
      </div>
    </div>
    </>
  );
};

export default AnalyticalSection;
