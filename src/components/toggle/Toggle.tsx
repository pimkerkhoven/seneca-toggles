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

    return (
        <div className={classNames} ref={toggleRef}>
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