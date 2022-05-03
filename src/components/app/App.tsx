import React, {useState} from 'react';
import { Question } from "../../types/Question";
import TogglesQuestion from "../toggles-question/TogglesQuestion";

function App() {
  const questions: Question[] = [{
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
  }, {
    title: "Things I can see right now:",
    parts: [
      {
        options: ["Cat", "Dog"],
        answer: "Cat"
      },
      {
        options: ["Ecology book", "Geology book"],
        answer: "Ecology book"
      },
      {
        options: ["Apple", "Banana", "Watermelon"],
        answer: "Apple"
      },
      {
        options: ["Glass", "Laptop charger"],
        answer: "Glass"
      }
    ]
  }]

  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0)

  function nextQuestion(event: React.MouseEvent) {
    event.preventDefault()

    setActiveQuestionIndex(prevState => (prevState + 1) % questions.length)
  }

  return <div style={{maxWidth: 900, margin: "0 auto"}}>
    <button onClick={nextQuestion}>Next Question</button>
    <TogglesQuestion question={questions[activeQuestionIndex]} />
  </div>
}

export default App;
