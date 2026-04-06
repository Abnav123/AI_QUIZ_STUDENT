import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import API from '../api';
import './Quiz.css';

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!submitted) {
      const timer = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [submitted, startTime]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/quizzes/${quizId}`);
      setQuiz(response.data);
      setAnswers(Array(response.data.questions.length).fill(''));
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    
    if (quiz.type === 'multiple response') {
      const currentAnswers = Array.isArray(newAnswers[currentQuestion]) 
        ? newAnswers[currentQuestion] 
        : [];
      
      if (currentAnswers.includes(answer)) {
        newAnswers[currentQuestion] = currentAnswers.filter(a => a !== answer);
      } else {
        newAnswers[currentQuestion] = [...currentAnswers, answer];
      }
    } else {
      newAnswers[currentQuestion] = answer;
    }
    
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      const response = await API.post('/attempts/submit', {
        quizId,
        answers,
        timeSpent
      });
      
      setSubmitted(true);
      setTimeout(() => {
        navigate(`/result/${response.data.attempt._id}`);
      }, 2000);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-container">
        <div className="error-screen">
          <p>Quiz not found</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="quiz-container">
        <div className="submitted-screen">
          <CheckCircle size={64} color="#10B981" />
          <h1>Quiz Submitted!</h1>
          <p>Redirecting to results...</p>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const currentAnswer = answers[currentQuestion];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="quiz-title">
          <h1>{quiz.title}</h1>
          <span className="quiz-type-badge">{quiz.type}</span>
        </div>
        <div className="timer">
          <Clock size={20} />
          {formatTime(timeSpent)}
        </div>
      </header>

      <main className="quiz-content">
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="progress-text">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>

        <div className="question-section">
          <h2 className="question-text">{question.question}</h2>

          <div className="answers-section">
            {quiz.type === 'MCQ' && (
              <div className="options-grid">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    className={`option-btn ${currentAnswer === option ? 'selected' : ''}`}
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {quiz.type === 'true/false' && (
              <div className="true-false-options">
                {['True', 'False'].map((option) => (
                  <button
                    key={option}
                    className={`true-false-btn ${currentAnswer === option ? 'selected' : ''}`}
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {quiz.type === 'short answer' && (
              <div className="short-answer">
                <textarea
                  value={currentAnswer}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  rows="4"
                />
              </div>
            )}

            {quiz.type === 'multiple response' && (
              <div className="multiple-response">
                {question.options.map((option, idx) => (
                  <label key={idx} className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={Array.isArray(currentAnswer) && currentAnswer.includes(option)}
                      onChange={() => handleAnswer(option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="navigation-section">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="btn-nav"
          >
            Previous
          </button>

          <div className="question-dots">
            {quiz.questions.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${idx === currentQuestion ? 'active' : ''} ${answers[idx] ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(idx)}
                title={`Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button onClick={handleSubmit} className="btn-submit">
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="btn-nav"
            >
              Next
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Quiz;
