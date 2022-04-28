import React, {useEffect, useState} from 'react';

// TODO: refactor types to own file
// TODO: add assumption to Readme
// Assume answer is included in options
interface QuestionPart {
  options: string[]
  answer: string
}

interface Question {
  title: String
  parts: QuestionPart[]
}

function App() {
  const question: Question = {
    // TODO: Where to format question? Assume is in correct format (capitalization?)
    //  Same for options
    title: "An animal cell contains",
    parts: [
      {
        options: ["Cell wall", "Ribosomes"],
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

  // TODO: not necessary, can be determined based on locked
  const [locked, setLocked] = useState<boolean>(false)

  // TODO: make sure never starts in answered formation
  const [answers, setAnswers] = useState<string[]>(question.parts.map(part => part.options[0]))

  // TODO: include event.preventDefault
  const handleClickAnswer = (partIndex: number, option: string) => {
    if (locked) {
      return
    }

    setAnswers(prevState =>
        [...prevState.slice(0, partIndex), option, ...prevState.slice(partIndex + 1)])
  }

  useEffect(() => {
    const answeredCorrectly = answers.reduce((accumulator, currentAnswer, index) => {
      return accumulator && question.parts[index].answer === currentAnswer
    }, true)

    if (answeredCorrectly) {
      setLocked(true)
    }
  }, [answers, question.parts])

  return (
    <div className="App">
      <h1>{question.title}</h1>
      {question.parts.map((part, partIndex) => (
          <div key={partIndex} style={{margin: 10, border: '1px solid black'}}>
            {part.options.map(option => {
              const style = option === answers[partIndex] ? { fontWeight : "bold" } : {}

              return <div key={option} style={style} onClick={() => handleClickAnswer(partIndex, option)}>
                {option}
              </div>
            })}
          </div>
      ))}
      <h1>{locked ? "The answer is correct!" : "The answer is incorrect"}</h1>
    </div>
  );
}

export default App;
