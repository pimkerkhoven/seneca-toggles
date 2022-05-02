import React, {useEffect, useState} from 'react';
import { Question } from "../../types/Question";
import Toggle from "../toggle/Toggle";
import "./TogglesQuestion.css"

interface TogglesQuestionProps {
    question: Question
}

function calculateGradient(percentageCorrect: number) {
    if (percentageCorrect === 1) {
        return "correct"
    }

    if (percentageCorrect > 0.5) {
        return "partially-correct"
    }

    return "incorrect"
}

const TogglesQuestion: React.FC<TogglesQuestionProps> = ({question: {title, parts}}) => {
    // Indicates whether the question is answered correctly (i.e. if all parts are answered correctly)
    // TODO: consistent naming of boolean variables is.../are.../has...
    const [numberOfCorrectAnswers, setNumberOfCorrectAnswers] = useState<number>(0)

    // TODO: make sure never starts in answered formation
    const [answers, setAnswers] = useState<string[]>(parts.map(part => part.options[0]))

    // TODO: include event.preventDefault
    function handleToggleAnswer(partIndex: number) {
        return function (option: string) {
            if (numberOfCorrectAnswers === parts.length) {
                return
            }

            setAnswers(prevState =>
                [...prevState.slice(0, partIndex), option, ...prevState.slice(partIndex + 1)])
        }
    }

    useEffect(() => {
        // Check for each question if the current answer is the actual answer for the question
        // Combine this result with the result of the previous questions
        // TODO: maybe there is a dedicated array function for this?
        const currentNumberOfCorrectAnswers = answers.reduce((accumulator, currentAnswer, index) => {
            if (parts[index].answer === currentAnswer) {
                return accumulator + 1
            }

            return accumulator
        }, 0)

        setNumberOfCorrectAnswers(currentNumberOfCorrectAnswers)
    }, [answers, parts])

    const isSolved = numberOfCorrectAnswers === parts.length

    const correctnessClass = calculateGradient(numberOfCorrectAnswers / parts.length)

    return (
        <div className={"TogglesQuestion " + correctnessClass} >
            <h1>{title}</h1>
            {parts.map((part, partIndex) =>
                <Toggle
                    key={partIndex}
                    part={part}
                    onToggle={handleToggleAnswer(partIndex)}
                    currentAnswer={answers[partIndex]} />
            )}
            <h2>{isSolved ? "The answer is correct!" : "The answer is incorrect"}</h2>
        </div>
    )
}

export default TogglesQuestion