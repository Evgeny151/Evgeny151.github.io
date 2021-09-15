import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import axios from 'axios';

import { QuestionCard } from './QuestionCard/QuestionCard';
import 'antd/dist/antd.css'
import './App.css';

export function App() {
  const [results, setResults] = useState([])
  const [loadingStatus, setLoadingStatus] = useState('idle')
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [scoreInfo, setScoreInfo] = useState([])
  const [statistics, setStatistics] = useState({
    easy: 0,
    medium: 0,
    hard: 0
  })

  const loadQuestions = async () => {
    setLoadingStatus('pending')
    await axios('https://opentdb.com/api.php?amount=5')
      .then(response => {
        const data = response.data.results.map(item => {
          const fullRandomAnswers = [ ...item.incorrect_answers, item.correct_answer ]
            .sort(() => Math.round(Math.random() * 100) - 50)
          return {
            ...item,
            incorrect_answers: fullRandomAnswers,
            question: item.question.replace(/&quot;/g,'"')
          }
        });

        setResults(data)
        setLoadingStatus('fulfilled')
      })
      .catch(error => {
        setLoadingStatus('rejected')
        console.log('error', error)
      })
  }

  useEffect(() => {
    loadQuestions()
  }, [])

  useEffect(() => {
    if (scoreInfo.length) {
      if (scoreInfo[currentQuestion - 1].correct_answer === scoreInfo[currentQuestion - 1].selectedAnswer) {
        let newScore = score + 1
        setScore(newScore)

        setStatistics({
          ...statistics,
          [scoreInfo[currentQuestion - 1].difficulty]: statistics[scoreInfo[currentQuestion - 1].difficulty] + 1
        })
      }
    }
  }, [scoreInfo])

  const handleAnswerClick = (e) => {
    setScoreInfo((prev) => {
        return [
          ...prev,
          {
            selectedAnswer: e.target.value,
            correct_answer: results[currentQuestion].correct_answer,
            difficulty: results[currentQuestion].difficulty
          }
        ]

    })

    const nextQuestion = currentQuestion + 1
    
    if (nextQuestion < results.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      setShowScore(true)
    }

  }

  const onHandleTryAgainClick = () => {
    loadQuestions()
    setCurrentQuestion(0)
    setShowScore(false)
    setScoreInfo([])
    setScore(0)
    setStatistics({
      easy: 0,
      medium: 0,
      hard: 0
    })
  }

  return (
    <div className="App">
      { loadingStatus === 'pending' && <Spin tip="Загрузка вопросов..." /> }
      { loadingStatus === 'fulfilled' &&
        <QuestionCard
          questions={results}
          currentQuestion={currentQuestion}
          questionsCount={results.length}
          onChange={handleAnswerClick}
          showScore={showScore}
          score={score}
          onHandleTryAgainClick={onHandleTryAgainClick}
          statistics={statistics}
        />
      }
    </div>
  );
}
