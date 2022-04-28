import React, {useEffect, useState} from 'react';

// TODO: refactor types to own file
// TODO: add assumption to Readme
// TODO: also have assumptions in comments surrounding code
// Assume answer is included in options
interface QuestionPart {
  options: string[]
  answer: string
}

interface Question {
  title: String
  parts: QuestionPart[]
}

// TODO: add component level (multi-line) comment indicating purpose/intent
function App() {
  const question: Question = {
    // TODO: Where to format question? Assume is in correct format (capitalization?)
    //  Same for options
    // TODO: Assume options are all unique within part
    // TODO: State assumption of question format.
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

  // Indicates whether the question is answered correctly (i.e. if all parts are answered correctly)
  // TODO: consistent naming of boolean variables is.../are.../has...
  const [isSolved, setIsSolved] = useState<boolean>(false)

  // TODO: maybe this works a bit nicer if answers is an object?  with a key for each part? How
  //  will typescript handle this?
  //  -> https://stackoverflow.com/questions/41045924/how-to-represent-a-variable-key-name-in-typescript-interface
  // TODO: make sure never starts in answered formation
  const [answers, setAnswers] = useState<string[]>(question.parts.map(part => part.options[0]))

  // TODO: include event.preventDefault
  const handleToggleAnswer = (partIndex: number, option: string) => {
    if (isSolved) {
      return
    }

    setAnswers(prevState =>
        [...prevState.slice(0, partIndex), option, ...prevState.slice(partIndex + 1)])
  }

  useEffect(() => {
    // Check for each question if the current answer is the actual answer for the question
    // Combine this result with the result of the previous questions
    // TODO: maybe there is a dedicated array function for this?
    const areAllAnswersCorrect = answers.reduce((accumulator, currentAnswer, index) => {
      return accumulator && question.parts[index].answer === currentAnswer
    }, true)

    if (areAllAnswersCorrect) {
      setIsSolved(true)
    }
  }, [answers, question.parts])

  // TODO: change cursor to pointer when hovering (un)selected options
  // TODO: search if there are accessibility/better options than just using divs
  return (
    <div className="App">
      <h1>{question.title}</h1>
      {question.parts.map((part, partIndex) => (
          <div key={partIndex} style={{margin: 10, border: '1px solid black'}}>
            {part.options.map(option => {
              const style = option === answers[partIndex] ? { fontWeight : "bold" } : {}

              return <div key={option} style={style} onClick={() => handleToggleAnswer(partIndex, option)}>
                {option}
              </div>
            })}
          </div>
      ))}
      <h1>{isSolved ? "The answer is correct!" : "The answer is incorrect"}</h1>
    </div>
  );
}

export default App;
