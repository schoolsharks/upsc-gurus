// import React, { useState } from 'react';
// import './verbal.css';


// const TwoBlanksAns = ({options}) => {
  
//   console.log(options);
   
//   const [selectedBlankOne, setSelectedBlankOne] = useState<string | null>(null);
//   const [selectedBlankTwo, setSelectedBlankTwo] = useState<string | null>(null);

//   const handleBlankOneChange = (option: string) => {
//     setSelectedBlankOne(option);
//   };

//   const handleBlankTwoChange = (option: string) => {
//     setSelectedBlankTwo(option);
//   };

//   return (
//     <>
    
//     <div className="fifth-verbal-container">
   

//         <div className="blanks-container">
//           <div className="blank-column">
//             <p style={{marginBottom:"20px"}}>Blank (i)</p>
//             {Array.isArray(options[0]) && options[0].map((option, index) => (
//               <label key={index} className={`option-label ${selectedBlankOne === option ? 'selected' : ''}`}>
//                 <input
//                   type="radio"
//                     name="blankOne"
//                   value={option}
//                   checked={selectedBlankOne === option}
//                   onChange={() => handleBlankOneChange(option)}
//                 />
//                 {option}
//               </label>
//             ))}
//           </div>

//           <div className="blank-column">
//             <p style={{marginBottom:"20px"}}>Blank (ii)</p>
//             {Array.isArray(options[1]) && options[1].map((option, index) => (
//               <label key={index} className={`option-label ${selectedBlankTwo === option ? 'selected' : ''}`}>
//                 <input
//                   type="radio"
//                     name="blankTwo"
//                   value={option}
//                   checked={selectedBlankTwo === option}
//                   onChange={() => handleBlankTwoChange(option)}
//                 />
//                 {option}
//               </label>
//             ))}
//           </div>
//         </div>
     

//       <p className="instruction-text">Select one entry from two column.</p>
//     </div>
//     </>
//   );
// };

// export default TwoBlanksAns;
