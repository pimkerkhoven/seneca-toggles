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

// TODO: passing down the toggle option is not really nice
const Toggle: React.FC<ToggleProps> = ({part: {options}, currentAnswer, onToggle}) => {
    // TODO: block click on toggle option if option equals current answer

    const [isStacked, setIsStacked] = useState<boolean>(false)

    const toggleRef = useRef<HTMLDivElement | null>(null)

    // Handle resizing of window. If options become to wide for their container.
    //  We need to display the toggle as a stacked toggle, with the options stacked
    //  on top of each other instead of next to each other.
    useEffect(() => {
        // TODO: explain use/purpose of `minStackWidth`
        // TODO: only works when coming from above real min resize size;
        //  it is not useful when we start below the real min size, then we
        //  still have the flickering
        let minStackWidth = Infinity

        function handleResize() {
            if (!toggleRef.current) {
                return
            }

            // The children of the toggle are the options of the toggle.
            const children = toggleRef.current.children


            // Loop over all `ToggleOptions` and check for each if it is too narrow
            //  to display its content. If this is the case for one `ToggleOption`,
            //  display the `Toggle` as stacked
            for (let i = 0; i < children.length; i++) {
                const child = children.item(i) as HTMLDivElement

                if (child.offsetWidth < child.scrollWidth) {
                    setIsStacked(true)

                    if (minStackWidth === Infinity || toggleRef.current.offsetWidth > minStackWidth) {
                        minStackWidth = toggleRef.current.offsetWidth
                    }

                    return
                }
            }

            if (toggleRef.current.offsetWidth > minStackWidth ) {
                setIsStacked(false)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

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