import  { useState } from 'react';
import './verbal.css';
import Header from '../../components/Header';

const ForthVerbalQuest = () => {
  const options = ['conjure up', 'covet', 'deflect', 'grasp', 'shrug off', 'understand'];
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const handleCheckboxChange = (option: string) => {
    if (selectedAnswers.includes(option)) {
      const updatedAnswers = selectedAnswers.filter((answer) => answer !== option);
      setSelectedAnswers(updatedAnswers);
    } else if (selectedAnswers.length < 2) {
      const updatedAnswers = [...selectedAnswers, option];
      setSelectedAnswers(updatedAnswers);
    }
  };

  return (
    <>
      <Header />
    
    <div className="verbal-quest-container">
      
      <div className="question-container">
        <div className="question-header">
          Select the two answer choices that, when used to complete the sentence, fit the meaning of the sentence as a whole.
        </div>
        <p className="question-text">
          Cynics believe that people who __________ compliments do so in order to be praised twice.
        </p>
        <div className="options-column">
          {options.map((option, index) => (
            <label key={index} className="checkbox-label">
              <input
                type="checkbox"
                value={option}
                checked={selectedAnswers.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                disabled={!selectedAnswers.includes(option) && selectedAnswers.length >= 2}
              />
              <span className="custom-checkbox"></span>
              {option}
            </label>
          ))}
        </div>
        <p className="instruction-text">Select two answer choices.</p>
      </div>
    </div>
    </>
  );
};

export default ForthVerbalQuest;
