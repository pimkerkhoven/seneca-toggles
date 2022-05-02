import React, {useEffect, useState} from 'react';
import { Question } from "../../types/Question";
import Toggle from "../toggle/Toggle";
import "./TogglesQuestion.css"
import {randomNumber, shuffleArray} from "../../util";

interface TogglesQuestionProps {
    question: Question
}

// TODO: this has assumptions about when to show which correctness level
// TODO: refactor and move to appropriate position
function getCorrectnessClass(percentageCorrect: number) {
    if (percentageCorrect === 1) {
        return "correct"
    }

    if (percentageCorrect > 0.5) {
        return "partially-correct"
    }

    return "incorrect"
}

const TogglesQuestion: React.FC<TogglesQuestionProps> = ({question: {title, parts}}) => {
    // Indicates how many parts of the question are answered correct
    // TODO: consistent naming of boolean variables is.../are.../has...
    const [numberOfCorrectAnswers, setNumberOfCorrectAnswers] = useState<number>(0)

    const [answers, setAnswers] = useState<string[]>([])

    function handleToggleAnswer(partIndex: number) {
        return function (option: string) {
            // It is not possible to change an answer, when all
            // answers are already correct
            if (numberOfCorrectAnswers === parts.length) {
                return
            }

            setAnswers(prevState =>
                [
                    ...prevState.slice(0, partIndex),
                    option,
                    ...prevState.slice(partIndex + 1)
                ]
            )
        }
    }

    // Before the first render shuffle the parts of the question and also shuffle their options
    // Next we initialize the initial answers for each part. We make sure the question never starts
    // in a completely answered formation
    useEffect(() => {
        shuffleArray(parts)
        parts.forEach(part => shuffleArray(part.options))

        // Make sure less than 50% of all answers is initialised as the correct answer
        // We do not initialise all questions as incorrect as this would make the correct
        // answer too obvious.
        let initialisedAsCorrectAnswer = 0
        const maxInitialisedCorrectly = Math.floor(0.5 * parts.length)

        // TODO: assumption at least two options
        const initialAnswers: string[] = parts.map(part => {
            let index = randomNumber(0, part.options.length)
            const answer = part.options[index]

            if (answer === part.answer) {
                if (initialisedAsCorrectAnswer < maxInitialisedCorrectly) {
                    initialisedAsCorrectAnswer += 1
                    return answer
                }

                // If we already initialised too many parts with the correct answer
                //  we skip to the option after the correct option. We make sure to wrap
                //  around to not get an undefined answer.
                index = (index + 1) % part.options.length
                return part.options[index]
            }

            return answer
        })

        setAnswers(initialAnswers)
    }, [parts])

    useEffect(() => {
        // Check for each question if the current answer is the actual answer for the question
        // Keep a count of how many are answered correct.
        const currentNumberOfCorrectAnswers =
            answers.reduce((accumulator, currentAnswer, index) =>
                    parts[index].answer === currentAnswer
                        ? accumulator + 1
                        : accumulator
                , 0)

        setNumberOfCorrectAnswers(currentNumberOfCorrectAnswers)
    }, [answers, parts])


    const correctnessClass = getCorrectnessClass(numberOfCorrectAnswers / parts.length)

    const resultText = numberOfCorrectAnswers === parts.length
        ? "The answer is correct!"
        : "The answer is incorrect"

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
            <h2>{resultText}</h2>
        </div>
    )
}

export default TogglesQuestion