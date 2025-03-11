


// import { useSelector } from 'react-redux';
// import ExactlyTwoMCQ from './ExactlyMCQTwo';
// import TextParagrabh from '../components/TextParagrabh';
// import Header from '@/components/Header';
// import MCQSingleAnswer from './MCQSingleAnswer';
// import MCQMultipleAnswer from './MCQMultipleAnswer';

// import TwoBlanksAns from '@/sections/verbal/TwoBlanksAns';


// const TestComponent = () => {
//   const currentQuestion = useSelector((state) => state.question.currentQuestion);

//   console.log("Inside TestComponent, currentQuestion:", currentQuestion); 
   

//   // Function to render the question content based on the type (text, image, etc.)
//   const renderQuestionPrompt = () => {
    
      
//         if (currentQuestion.positioning === 'splitScreen') {
//           return (
//             <div style={{ display: 'flex' , marginLeft:"50px"}}>
//               <div style={{ border: '1px solid black', flex: 1, display: 'flex' , flexDirection:"column" , }}>
//                 <div style={{backgroundColor:"blue" , width:"100%",padding:"10px"}}>
//                   <p>Questions 1 TO 3 ARE BASED ON THIS PASSAGE.</p>
//                 </div>
//                 <TextParagrabh  />
//               </div>
              
//             </div>
//           );
//         } else if (currentQuestion.positioning === 'center') {
//           return (
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' , border:"none" }}>
//               <TextParagrabh  />
//             </div>
//           );
//         }
     
//       return null; 
//     }
  
  
  
  

//   // Render the appropriate options based on the question type
//   const renderOptions = () => {
//     const showHeading = currentQuestion.positioning !== 'center';
//     switch (currentQuestion.type) {
//       case 'MCQ-SINGLE':
//         return <MCQSingleAnswer options={currentQuestion.options[0]} isCentered={showHeading} />;
//       case 'MCQ-MULTIPLE':
//         return <MCQMultipleAnswer options={currentQuestion.options[0]} />;
//       case 'EXACTLY-TWO-MCQ':
//         return <ExactlyTwoMCQ options={currentQuestion.options[0]} showHeading={showHeading} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//     <Header/>
//     <div
//   style={{
//     display: currentQuestion.positioning === 'splitScreen' ? 'flex' : 'block',
//     justifyContent: currentQuestion.positioning === 'center' ? 'center' : 'flex-start',
//     alignItems: currentQuestion.positioning === 'center' ? 'center' : 'flex-start',
//     minHeight: currentQuestion.positioning === 'center' ? '100vh' : 'auto', // Full height for vertical centering
//     marginLeft: currentQuestion.positioning === 'splitScreen' ? '0' : '30px', 
     
//   }}
// >
//   <div>{renderQuestionPrompt()}</div>
  
//   {/* Apply the center alignment to renderOptions */}
//   <div
//     style={{
//       marginLeft: currentQuestion.positioning === 'splitScreen' ? '0' : '-100px', 
//       marginTop: currentQuestion.positioning === 'splitScreen' ? '0' : '-180px',
//       display: currentQuestion.positioning === 'center' ? 'flex' : 'block', 
//       justifyContent: currentQuestion.positioning === 'center' ? 'center' : 'flex-start',
//       alignItems: currentQuestion.positioning === 'center' ? 'center' : 'flex-start',
//     }}
//   >
//     {renderOptions()}
//   </div>
// </div>

//     </>
//   );
// };

// export default TestComponent;
