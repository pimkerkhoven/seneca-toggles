import React from "react";
import {QuestionPart} from "../../types/Question";

interface ToggleOptionProps {
    optionText: string,
    selected: boolean,
    toggle: (option: string) => void
}

const ToggleOption: React.FC<ToggleOptionProps> = ({optionText, selected, toggle}) => {
    function handleOnClick(event: React.MouseEvent) {
        event.preventDefault()

        toggle(optionText)
    }

    const style = selected ? { fontWeight : "bold" } : {}

    return (
        <div style={style} onClick={handleOnClick}>
            {optionText}
        </div>
    )
}


interface ToggleProps {
    part: QuestionPart,
    currentAnswer: string,
    onToggle: (option: string) => void
}

// TODO: passing down the toggle option is not really nice
const Toggle: React.FC<ToggleProps> = ({part: {options}, currentAnswer, onToggle}) => {
    // TODO: block click on toggle option if option equals current answer
    return (
        <div style={{margin: 10, border: '1px solid black'}}>
            {options.map(option => {
                return <ToggleOption
                    key={option}
                    optionText={option}
                    selected={option === currentAnswer}
                    toggle={onToggle} />
            })}
        </div>
    )
}

export default Toggle