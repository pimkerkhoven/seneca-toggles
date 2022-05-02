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
            <span>{optionText}</span>
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

    const [isStacked, setIsStacked] = useState<boolean>(false)

    const toggleRef = useRef<HTMLDivElement | null>(null)

    // Handle resizing of window. If options become to wide for their container.
    //  We need to display the toggle as a stacked toggle, with the options stacked
    //  on top of each other instead of next to each other.
    useEffect(() => {
        function handleResize() {
            if (!toggleRef.current) {
                return
            }

            const children = Array.from(toggleRef.current.children)

            const textWidthsOfChildren = children.map(child => {
                const textSpan = child.children.item(0) as HTMLSpanElement

                if (textSpan) {
                    // TODO: extract 10 to variable as PADDING
                    return textSpan.getBoundingClientRect().width + 10
                }

                return 0
            })

            const maxSpanWidth = Math.max(...textWidthsOfChildren)

            if (maxSpanWidth * options.length < toggleRef.current.clientWidth) {
                setIsStacked(false)
            } else {
                setIsStacked(true)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [toggleRef, options.length])

    const classNames = isStacked ? "Toggle stacked" : "Toggle"

    const currentAnswerIndex = options.findIndex(option => option === currentAnswer)
    const sliderPosition = getSliderPosition(options.length, currentAnswerIndex, isStacked)

    return (
        <div className={classNames} ref={toggleRef}>
            <div className="slider" style={sliderPosition} />
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


/**
 * TODO: finish documentation
 *
 * @param numberOfOptions
 * @param currentAnswerIndex
 * @param isStacked
 */
function getSliderPosition(numberOfOptions: number,
                           currentAnswerIndex: number,
                           isStacked: boolean): React.CSSProperties {
    const size = 100 / numberOfOptions

    if (isStacked) {
        return {
            width: "100%",
            height: size + "%",
            left: 0,
            top: size * currentAnswerIndex + "%"
        }
    }

    return {
        width: size + "%",
        height: "100%",
        left: size * currentAnswerIndex + "%",
        top: 0
    }
}