import React, {useEffect, useState} from 'react';
import { Question } from "../../types/Question";
import Toggle from "../toggle/Toggle";
import "./TogglesQuestion.css"
import {randomNumber, shuffleArray} from "../../util";

interface TogglesQuestionProps {
    question: Question
}

const TogglesQuestion: React.FC<TogglesQuestionProps> = ({question: {title, parts}}) => {
    // Indicates how many parts of the question are answered correct
    const [numberOfCorrectAnswers, setNumberOfCorrectAnswers] = useState<number>(0)
    const [answers, setAnswers] = useState<string[]>([])

    // Before the rendering a question shuffle the parts of the question and also shuffle their options.
    //  Next we initialize the initial answers for each part. We make sure the question never starts
    //  in a completely answered formation.
    useEffect(() => {
        shuffleArray(parts)
        parts.forEach(part => shuffleArray(part.options))

        // Make sure less than 50% of all answers is initialised as the correct answer
        // We do not initialise all questions as incorrect as this would make the correct
        // answer too obvious. We multiply by 0.49, because using 0.5 can result in initializing
        // the question as partially correct for an even number of parts.
        let initialisedAsCorrectAnswer = 0
        const maxInitialisedCorrectly = Math.floor(0.49 * parts.length)

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

    // When a new answer is entered, check how many parts are currently answered correct.
    useEffect(() => {
        // For each question part check if the current answer is the correct answer.
        // Keep a count of how many are correct.
        const currentNumberOfCorrectAnswers =
            answers.reduce((totalCorrect, currentAnswer, index) =>
                    parts[index].answer === currentAnswer
                        ? totalCorrect + 1
                        : totalCorrect
                , 0)

        setNumberOfCorrectAnswers(currentNumberOfCorrectAnswers)

        // `parts` is not included in the dependencies array, because this causes an
        // error when changing between questions that do not have an equal number of parts.
        // This is a result of running this effect before the initial answers for the new question
        // are set. This leads to a mismatch between parts and answers.
        // Because we change the answers when a new question is loaded (with the effect above), this
        // effect will always run for a new question, but now after the answers match the current parts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answers])

    function createHandleToggleAnswerForQuestionPart(partIndex: number) {
        // Create the specific function for answering a certain part
        return function(option: string) {
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

    // The correctness class shows what percentage of the question parts is answered correctly.
    //  Between 0 and 50% is incorrect, 50% and 100% is partially correct and 100% is correct.
    //  Each class has its own color scheme (red, yellow, green).
    const correctnessClass = getCorrectnessClass(numberOfCorrectAnswers / parts.length)

    const resultText = numberOfCorrectAnswers === parts.length
        ? "The answer is correct!"
        : "The answer is incorrect"

    return (
        <div className={`toggles-question ${correctnessClass}`}>
            <h1>{title}</h1>
            {parts.map((part, partIndex) =>
                <Toggle
                    key={partIndex}
                    questionPart={part}
                    onToggle={createHandleToggleAnswerForQuestionPart(partIndex)}
                    currentAnswer={answers[partIndex]} />
            )}
            <h2>{resultText}</h2>
        </div>
    )
}

export default TogglesQuestion

function getCorrectnessClass(percentageCorrect: number) {
    if (percentageCorrect === 1) {
        return "correct"
    }

    if (percentageCorrect >= 0.5) {
        return "partially-correct"
    }

    return "incorrect"
}