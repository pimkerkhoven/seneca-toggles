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
    title: "An animal cell contains",
    parts: {
      1: {
        options: ["Cell wall", "Ribosomes"],
        answer: "Cell wall"
      },
      2: {
        options: ["Cytoplasm", "Chloroplast"],
        answer: "Cytoplasm"
      },
      3: {
        options: ["Partial membrane", "Impermeable membrane"],
        answer: "Impermeable membrane"
      }
    }
  }

  // TODO: change cursor to pointer when hovering (un)selected options
  // TODO: search if there are accessibility/better options than just using divs
  return <TogglesQuestion question={question} />
}

export default App;
