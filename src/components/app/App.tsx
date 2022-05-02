import React from 'react';
import { Question } from "../../types/Question";
import TogglesQuestion from "../toggles-question/TogglesQuestion";

// TODO: add component level (multi-line) comment indicating purpose/intent
function App() {
  const question: Question = {
    // TODO: Where to format question? Assume is in correct format (capitalization?)
    //  Same for options
    // TODO: Assume options are all unique within part
    // TODO: State assumption of question format.
    title: "An animal cell contains:",
    parts: [
      {
        options: ["Cell wall", "Ribosomes", "Glucose", "Printers"],
        answer: "Cell wall"
      },
      {
        options: ["Cytoplasm", "Chloroplast"],
        answer: "Cytoplasm"
      },
      {
        options: ["Partial membrane", "Impermeable membrane"],
        answer: "Impermeable membrane"
      }
    ]
  }

  // TODO: change cursor to pointer when hovering (un)selected options
  // TODO: search if there are accessibility/better options than just using divs
  return <div style={{maxWidth: 900, margin: "0 auto"}}>
    <TogglesQuestion question={question} />
  </div>
}

export default App;
