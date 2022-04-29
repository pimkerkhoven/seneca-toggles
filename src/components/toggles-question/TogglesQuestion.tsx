import React, {useEffect, useState} from 'react';
import { Question } from "../../types/Question";
import Toggle from "../toggle/Toggle";

interface TogglesQuestionProps {
    question: Question
}

const TogglesQuestion: React.FC<TogglesQuestionProps> = ({question: {title, parts}}) => {
    // Indicates whether the question is answered correctly (i.e. if all parts are answered correctly)
    // TODO: consistent naming of boolean variables is.../are.../has...
    const [isSolved, setIsSolved] = useState<boolean>(false)

    // TODO: maybe this works a bit nicer if answers is an object?  with a key for each part? How
    //  will typescript handle this?
    //  -> https://stackoverflow.com/questions/41045924/how-to-represent-a-variable-key-name-in-typescript-interface
    // TODO: make sure never starts in answered formation
    const [answers, setAnswers] = useState<{[partId: string]: string}>(
        Object.keys(parts).reduce((answers, partId) => ({
            ...answers,
            [partId]: parts[partId].options[0]
        }), {}))



    // TODO: include event.preventDefault
    function handleToggleAnswer(partId: string) {
        return function (option: string) {
            if (isSolved) {
                return
            }

            setAnswers(prevState => ({
                ...prevState,
                [partId]: option
            }))
        }
    }

    useEffect(() => {
        // Check for each question if the current answer is the actual answer for the question
        // Combine this result with the result of the previous questions
        // TODO: maybe there is a dedicated array function for this?
        const areAllAnswersCorrect = Object.keys(answers)
            .reduce((accumulator, partId) => {
                const currentAnswer = answers[partId]

                return accumulator && parts[partId].answer === currentAnswer
            }, true)

        if (areAllAnswersCorrect) {
            setIsSolved(true)
        }
    }, [answers, parts])


    return (
        <div className="TogglesQuestion">
            <h1>{title}</h1>
            {Object.keys(parts).map(partId =>
                <Toggle
                    key={partId}
                    part={parts[partId]}
                    onToggle={handleToggleAnswer(partId)}
                    currentAnswer={answers[partId]} />
            )}
            <h1>{isSolved ? "The answer is correct!" : "The answer is incorrect"}</h1>
        </div>
    )
}

export default TogglesQuestion