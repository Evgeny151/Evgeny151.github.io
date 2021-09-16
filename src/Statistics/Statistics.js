import { Button } from 'antd'

import './style.css'

export const Statistics = ({
    rootClass,
    score,
    statistics,
    onHandleTryAgainClick
}) => {
    const { easy, medium, hard } = statistics
    return (
        <>
            <div className={`${rootClass}__correct-answers`}>
                Correct answers: {score}
            </div>
            <div className={`${rootClass}__statistics`}>
                <div>easy: {easy}</div>
                <div>medium: {medium}</div>
                <div>hard: {hard}</div>
            </div>
            <div className={`${rootClass}__btn`}>
                <Button
                    onClick={onHandleTryAgainClick}
                    size={'large'}
                >
                    Try again
                </Button>
            </div>
        </> 
    )
}