import React, {useEffect, useRef, useState} from "react";

import {QuestionPart} from "../../types/Question";
import './Toggle.css'

interface ToggleProps {
    questionPart: QuestionPart,
    currentAnswer: string,
    onToggle: (option: string) => void
}

const Toggle: React.FC<ToggleProps> = ({questionPart: {options}, currentAnswer, onToggle}) => {
    const [isStacked, setIsStacked] = useState<boolean>(false)

    const toggleRef = useRef<HTMLDivElement | null>(null)

    // Handle resizing of window. If options become to wide for their container,
    //  we need to display the toggle as a stacked toggle, with the options stacked
    //  on top of each other instead of next to each other.
    useEffect(() => {
        function handleResize() {
            if (!toggleRef.current) {
                return
            }

            // Determine the width of the text of the widest option. This is
            //  the width we use to calculate if all options fit next to each
            //  other within the Toggle.
            const maxOptionTextWidth = Array.from(toggleRef.current.children)
                .reduce((maxSize, child) => {
                    const textSpan = child.children.item(0) as HTMLSpanElement

                    if (textSpan) {
                        const spanSize = textSpan.getBoundingClientRect().width
                        if (spanSize > maxSize) {
                            return spanSize
                        }
                    }

                    return maxSize
                }, 0)

            // If the `maxOptionTextWidth` times the number of options is bigger than the
            //  width of the toggle, we stack the options. Otherwise, we display the options
            //  next to each other.
            setIsStacked(maxOptionTextWidth * options.length > toggleRef.current.clientWidth)
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [toggleRef, options.length])

    const currentAnswerIndex = options.findIndex(option => option === currentAnswer)

    // Set slider position based on which option is currently selected and whether
    //  the options are stacked or not
    const sliderPosition = getSliderPosition(options.length, currentAnswerIndex, isStacked)

    return (
        <div className={`toggle${isStacked ? " stacked" : ""}`} ref={toggleRef}>
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
        <div className={`toggle-option${selected ? " selected" : ""}`} onClick={handleToggle}>
            <span>{optionText}</span>
        </div>
    )
}

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