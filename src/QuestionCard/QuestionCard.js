import { Radio } from 'antd'
import './style.css'

export const QuestionCard = ({
    currentQuestionIndex,
    questionsCount,
    questions,
    onChange,
    rootClass
}) => {
    return (
        <>
            <div className={`${rootClass}__header`}>
                <div className={`${rootClass}__count`}>
                    <span>Question {currentQuestionIndex + 1}</span> / {questionsCount}
                </div>
                <div className={`${rootClass}__difficulty`}>
                    Difficulty: {questions[currentQuestionIndex].difficulty}
                </div>
            </div>
            <div className={`${rootClass}__text`}>
                {questions[currentQuestionIndex].question}
            </div>
            <Radio.Group
                onChange={onChange}
                className={`${rootClass}__answers`}
            >
                {questions[currentQuestionIndex].allAnswers.map((answer, index) => (
                    <Radio
                        key={index}
                        value={answer}
                    >
                        {answer}
                    </Radio>
                ))}
            </Radio.Group>
        </>
    )
}