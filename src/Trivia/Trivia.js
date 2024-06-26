import React, { useState, useEffect } from 'react';
import './Trivia.css';

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const Trivia = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(80);
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    if (gameStarted) {
      fetchQuestions();
    }
  }, [gameStarted]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      setShuffledAnswers(shuffleArray([...questions[currentQuestionIndex].incorrect_answers, questions[currentQuestionIndex].correct_answer]));
      resetTimer();
      setFeedback('');
    }
  }, [currentQuestionIndex, questions, gameStarted]);

  useEffect(() => {
    let interval;
    if (!waitingForNext && gameStarted) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => Math.max(0, prevTime - 1));
      }, 100);
      if (timeLeft === 0) {
        clearInterval(interval);
        handleTimeOut();
      }
    }
    return () => clearInterval(interval);
  }, [timeLeft, gameStarted, waitingForNext]);

  const fetchQuestions = async () => {
    const response = await fetch('https://opentdb.com/api.php?amount=50&difficulty=easy&type=multiple');
    const data = await response.json();
    if (data.response_code === 0 && Array.isArray(data.results)) {
      setQuestions(data.results.map(q => ({
        ...q,
        answers: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
      })));
    }
  };

  const resetTimer = () => {
    setTimeLeft(80);
    setWaitingForNext(false);
  };

  const handleTimeOut = () => {
    if (!waitingForNext) {
      setFeedback(`Time's up! The correct answer was: ${questions[currentQuestionIndex]?.correct_answer}`);
      setIncorrectCount(count => count + 1);
      setWaitingForNext(true);
      setTimeout(() => {
        showNextQuestion();
      }, 5000);
    }
  };

  const handleAnswerClick = (answer) => {
    if (!waitingForNext) {
      const isCorrect = answer === questions[currentQuestionIndex].correct_answer;
      setFeedback(isCorrect ? "Correct!" : `Wrong! The correct answer was: ${questions[currentQuestionIndex].correct_answer}`);
      if (isCorrect) {
        setCorrectCount(count => count + 1);
      } else {
        setIncorrectCount(count => count + 1);
      }
      setWaitingForNext(true);
      setTimeout(() => {
        showNextQuestion();
      }, 5000);
    }
  };

  const showNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(index => index + 1);
      resetTimer();
    } else {
      setFeedback("You've reached the end of the quiz!");
      setGameStarted(false);
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setCorrectCount(0);
    setIncorrectCount(0);
    resetTimer();
  };

  return (
    <div className="game-box">
      {!gameStarted ? (
        <>
        <h1>TRIVIA</h1>
        <button className="start-button" onClick={handleStartGame}>Start Game</button>
        </>
      ) : (
        <>
          {questions.length > 0 && currentQuestionIndex < questions.length ? (
            <>
              <div className="question" dangerouslySetInnerHTML={{ __html: questions[currentQuestionIndex].question }} />
              <div className="answers">
                {shuffledAnswers.map((answer, index) => (
                  <button key={index} className="answer-button" onClick={() => handleAnswerClick(answer)} dangerouslySetInnerHTML={{ __html: answer }} />
                ))}
              </div>
              <div className="feedback" style={{ opacity: feedback ? 1 : 0 }}>{feedback}</div>
              <div className="time-bar" style={{ width: `${timeLeft}%` }}></div>
              <div className="scoreboard">Correct: {correctCount} | Incorrect: {incorrectCount}</div>
            </>
          ) : (
            <div>Loading questions...</div>
          )}
        </>
      )}
    </div>
  );
};

export default Trivia;
