import { Button, Radio } from 'antd'
import './style.css'

export const QuestionCard = ({
    currentQuestion,
    questionsCount,
    questions,
    onChange,
    showScore,
    score,
    onHandleTryAgainClick,
    statistics
}) => {
    const ROOT_CLASS = 'question-card'
    return (
        <div className={ROOT_CLASS}>
            {showScore ?
                <div>
                    <div>Correct answers: {score}</div>
                    <div>
                        <div>easy: {statistics.easy}</div>
                        <div>medium: {statistics.medium}</div>
                        <div>hard: {statistics.hard}</div>
                    </div>
                    <Button type='primary' onClick={onHandleTryAgainClick}>Try again</Button>
                </div>
                :
                <>
                    <div className={`${ROOT_CLASS}__difficulty`}>
                        Difficulty: {questions[currentQuestion].difficulty}
                    </div>
                    <div className={`${ROOT_CLASS}__count`}>
                        <span>Question {currentQuestion + 1}</span> / {questionsCount}
                    </div>
                    <div className={`${ROOT_CLASS}__text`}>
                        {questions[currentQuestion].question}
                    </div>
                    <div className={`${ROOT_CLASS}__answers`}>
                        {
                            <Radio.Group onChange={onChange} >
                                {questions[currentQuestion].incorrect_answers.map(answer => (
                                    <Radio
                                        key={answer}
                                        value={answer}
                                    >
                                        {answer}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        }
                    </div> 
                </>
            }
        </div>
    )
}