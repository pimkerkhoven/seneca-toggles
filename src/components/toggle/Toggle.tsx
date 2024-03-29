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

    // Handle resizing of window. If the options no longer fit next to each other in the toggle
    //  without overflowing, we need to display the toggle as a stacked toggle.
    //  We then show the options stacked on top of each other instead of next to each other.
    useEffect(() => {
        function handleResize() {
            if (!toggleRef.current) {
                return
            }

            // Determine the text width of the widest option text. This is
            //  the width we use to calculate if all options fit next to each
            //  other within the Toggle. This works because all options have the same
            //  width, so all options are at least the size of the widest text.
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
    }, [toggleRef, options])

    const currentAnswerIndex = options.findIndex(option => option === currentAnswer)

    // Set slider position based on which option is currently selected and whether
    //  the options are stacked or not. We position the slider behind the currently
    //  selected option.
    const sliderPosition = getSliderPosition(options.length, currentAnswerIndex, isStacked)

    return (
        <div className={`toggle ${isStacked ? "stacked" : ""}`} ref={toggleRef}>
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
        <div className={`toggle-option ${selected ? "selected" : ""}`} onClick={handleToggle}>
            <span>{optionText}</span>
        </div>
    )
}

function getSliderPosition(numberOfOptions: number,
                           currentAnswerIndex: number,
                           isStacked: boolean): React.CSSProperties {
    const size = 100 / numberOfOptions

    if (isStacked) {
        // When stacked, the border radius of the slider depends on its position.
        //  If it is at the top, we only need a border radius at the top. If it is
        //  at the bottom, we need a border radius at the bottom of the slider.
        //  And if it is somewhere in the middle, we do not need a border radius.
        let borderRadius = "0"
        if (currentAnswerIndex === 0) {
            borderRadius = "24px 24px 0 0"
        } else if (currentAnswerIndex === numberOfOptions - 1) {
            borderRadius = "0 0 24px 24px"
        }

        // Subtract 2px from left and top, in order to position slider on top of the border
        //  of the underlying toggle component
        return {
            width: "100%",
            height: `${size}%`,
            left: "-2px",
            top: `calc(${size * currentAnswerIndex}% - 2px)`,
            borderRadius
        }
    }

    return {
        width: `${size}%`,
        height: "100%",
        left: `calc(${size * currentAnswerIndex}% - 2px)`,
        top: "-2px"
    }
}