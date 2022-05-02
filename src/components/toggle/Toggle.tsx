import React, {useEffect, useRef, useState} from "react";

import {QuestionPart} from "../../types/Question";
import './Toggle.css'

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

    const classNames = selected ? "ToggleOption selected" : "ToggleOption"

    return (
        <div className={classNames} onClick={handleOnClick}>
            {optionText}
        </div>
    )
}


interface ToggleProps {
    part: QuestionPart,
    currentAnswer: string,
    onToggle: (option: string) => void
}


// {width: sliderWidth + "%", left: sliderPosition + "%"}

function determineStyleFromOptionsAndLayout(numberOfOptions: number, currentAnswerIndex: number, isStacked: boolean) {
    const style = { width: "0", height: "0", left: "0", top: "0"}

    if (isStacked) {
        const height = 100 / numberOfOptions
        style.width = "100%"
        style.height = height + "%"
        style.left = "0"
        style.top = height * currentAnswerIndex + "%"
    } else {
        const width = 100 / numberOfOptions
        style.width = width + "%"
        style.height = "100%"
        style.left = width * currentAnswerIndex + "%"
        style.top = "0"
    }

    return style
}

// TODO: passing down the toggle option is not really nice
const Toggle: React.FC<ToggleProps> = ({part: {options}, currentAnswer, onToggle}) => {
    // TODO: block click on toggle option if option equals current answer

    const [isStacked, setIsStacked] = useState<boolean>(false)

    const toggleRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        let stackWidth = Infinity

        function handleResize() {
            if (!toggleRef.current) {
                return
            }
            const children = toggleRef.current.children

            for (let i = 0; i < children.length; i++) {
                const child = children.item(i) as HTMLDivElement

                if (child.offsetWidth < child.scrollWidth) {
                    setIsStacked(true)
                    if (stackWidth === Infinity || toggleRef.current.offsetWidth > stackWidth) {
                        stackWidth = toggleRef.current.offsetWidth
                    }

                    return
                }
            }

            if (stackWidth < toggleRef.current.offsetWidth) {
                setIsStacked(false)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const classNames = isStacked ? "Toggle stacked" : "Toggle"

    const currentAnswerIndex = options.findIndex(option => option === currentAnswer)
    const style = determineStyleFromOptionsAndLayout(options.length, currentAnswerIndex, isStacked)

    return (
        <div className={classNames} ref={toggleRef}>
            <div className="slider" style={style} />
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