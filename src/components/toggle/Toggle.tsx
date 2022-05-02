import React, {useEffect, useRef, useState} from "react";

import {QuestionPart} from "../../types/Question";
import './Toggle.css'

interface ToggleOptionProps {
    optionText: string,
    selected: boolean,
    onToggle: (option: string) => void
}

const ToggleOption: React.FC<ToggleOptionProps> = ({optionText, selected, onToggle}) => {
    function handleToggle(event: React.MouseEvent) {
        event.preventDefault()

        onToggle(optionText)
    }

    return (
        <div className={`ToggleOption${selected ? " selected" : ""}`} onClick={handleToggle}>
            <span>{optionText}</span>
        </div>
    )
}


interface ToggleProps {
    questionPart: QuestionPart,
    currentAnswer: string,
    onToggle: (option: string) => void
}

// TODO: passing down the toggle option is not really nice
const Toggle: React.FC<ToggleProps> = ({questionPart: {options}, currentAnswer, onToggle}) => {
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

            const maxSpanWidth = Array.from(toggleRef.current.children)
                .reduce((maxSize, child) => {
                    const textSpan = child.children.item(0) as HTMLSpanElement

                    if (textSpan) {
                        // TODO: extract 10 to variable as PADDING
                        const spanSize = textSpan.getBoundingClientRect().width
                        if (spanSize > maxSize) {
                            return spanSize
                        }
                    }

                    return maxSize
                }, 0)

            setIsStacked(maxSpanWidth * options.length > toggleRef.current.clientWidth)
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [toggleRef, options.length])

    const currentAnswerIndex = options.findIndex(option => option === currentAnswer)
    const sliderPosition = getSliderPosition(options.length, currentAnswerIndex, isStacked)

    return (
        <div className={`Toggle${isStacked ? " stacked" : ""}`} ref={toggleRef}>
            <div className="slider" style={sliderPosition} />
            {options.map(option => {
                return <ToggleOption
                    key={option}
                    optionText={option}
                    selected={option === currentAnswer}
                    onToggle={onToggle} />
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