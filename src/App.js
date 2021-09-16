import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import axios from 'axios';

import { QuestionCard } from './QuestionCard/QuestionCard';
import { Statistics } from './Statistics/Statistics';
import 'antd/dist/antd.css'
import './App.css';

export function App() {
  const [questionList, setQuestionList] = useState([])
  const [loadingStatus, setLoadingStatus] = useState('idle')
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [scoreInfo, setScoreInfo] = useState([])
  const [statistics, setStatistics] = useState({
    easy: 0,
    medium: 0,
    hard: 0
  })

  const loadQuestions = () => {
    setLoadingStatus('pending')

    axios('https://opentdb.com/api.php?amount=5')
      .then(response => {
        const data = response.data.results.map(item => {
          const allAnswersInRandomOrder = [ ...item.incorrect_answers, item.correct_answer ]
            .sort(() => Math.round(Math.random() * 100) - 50)
          delete item['incorrect_answers']
          return {
            ...item,
            allAnswers: allAnswersInRandomOrder,
            question: item.question.replace(/&quot;/g,'"')
          }
        });

        setQuestionList(data)
        setLoadingStatus('fulfilled')
      })
      .catch(error => {
        alert('Error: ' + error)
      })
  }

  useEffect(() => {
    loadQuestions()
  }, [])

  const calculateStatistics = () => {
    const { newScore, newStatistics } = scoreInfo.reduce((acc, {correct_answer, selectedAnswer, difficulty}) => {
      if (correct_answer === selectedAnswer) {
        acc.newScore += 1
        acc.newStatistics = {
          ...acc.newStatistics,
          [difficulty]: acc.newStatistics[difficulty] + 1
        }
        return acc
      }
      return acc
    },{
        newScore: 0,
        newStatistics: { easy: 0, medium: 0, hard: 0 }
      })

    setScore(newScore)
    setStatistics(newStatistics)
  }

  const handleAnswerClick = (e) => {
    setScoreInfo((prev) => {
        return [
          ...prev,
          {
            selectedAnswer: e.target.value,
            correct_answer: questionList[currentQuestionIndex].correct_answer,
            difficulty: questionList[currentQuestionIndex].difficulty
          }
        ]

    })

    const nextQuestion = currentQuestionIndex + 1
    
    if (nextQuestion < questionList.length) {
      setCurrentQuestionIndex(nextQuestion)
    } else {
      calculateStatistics()
      setShowScore(true)
    }

  }

  const onHandleTryAgainClick = () => {
    loadQuestions()
    setCurrentQuestionIndex(0)
    setShowScore(false)
    setScoreInfo([])
    setScore(0)
    setStatistics({
      easy: 0,
      medium: 0,
      hard: 0
    })
  }

  const ROOT_CLASS = 'quiz-card'
  return (
    <div className="App">
      { loadingStatus === 'pending' && <Spin /> }
      { loadingStatus === 'fulfilled' &&
        <div className={ROOT_CLASS}>
          {
            !showScore ?
              <QuestionCard
                rootClass={ROOT_CLASS}
                questions={questionList}
                currentQuestionIndex={currentQuestionIndex}
                questionsCount={questionList.length}
                onChange={handleAnswerClick}
                showScore={showScore}
                score={score}
                onHandleTryAgainClick={onHandleTryAgainClick}
                statistics={statistics}
              />
              :
              <Statistics
                rootClass={ROOT_CLASS}
                score={score}
                statistics={statistics}
                onHandleTryAgainClick={onHandleTryAgainClick}
              />
          }
        </div>
      }
    </div>
  );
}
