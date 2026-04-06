import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Home, RotateCcw } from 'lucide-react';
import API from '../api';
import './Result.css';

const Result = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    fetchAttemptResult();
  }, [attemptId]);

  const fetchAttemptResult = async () => {
    try {
      const response = await API.get(`/attempts/user/attempt/${attemptId}`);
      setAttempt(response.data);
    } catch (error) {
      console.error('Error fetching result:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="result-container">
        <div className="loading">Loading results...</div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="result-container">
        <div className="error">Result not found</div>
      </div>
    );
  }

  const percentageScore = attempt.score;
  const isPassed = percentageScore >= 60;

  return (
    <div className="result-container">
      <div className="result-card">
        {/* Score Header */}
        <div className={`score-header ${isPassed ? 'passed' : 'failed'}`}>
          {isPassed ? (
            <CheckCircle size={80} />
          ) : (
            <XCircle size={80} />
          )}
          <h1>{isPassed ? 'Great Job!' : 'Review & Try Again'}</h1>
          <p className="score-text">{percentageScore}%</p>
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-box">
            <div className="stat-label">Correct Answers</div>
            <div className="stat-value" style={{ color: '#10B981' }}>
              {attempt.correctAnswers} / {attempt.totalQuestions}
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Score</div>
            <div className="stat-value" style={{ color: '#667eea' }}>
              {percentageScore}%
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Quiz Type</div>
            <div className="stat-value">{attempt.quizType}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Subject</div>
            <div className="stat-value">{attempt.subject}</div>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="performance-indicator">
          <div className="bar-container">
            <div 
              className={`bar-fill ${isPassed ? 'passed' : 'failed'}`}
              style={{ width: `${percentageScore}%` }}
            ></div>
          </div>
          <p className="performance-text">
            {percentageScore >= 80 && '🌟 Excellent Performance!'}
            {percentageScore >= 60 && percentageScore < 80 && '✨ Good Job!'}
            {percentageScore < 60 && '📚 Keep Practicing!'}
          </p>
        </div>

        {/* Detailed Answers */}
        <div className="answers-review">
          <h2>Answer Review</h2>
          <div className="answers-list">
            {attempt.answers.map((answer, idx) => (
              <div key={idx} className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                <div 
                  className="answer-header"
                  onClick={() => setExpandedQuestion(expandedQuestion === idx ? null : idx)}
                >
                  <div className="answer-number">
                    {answer.isCorrect ? (
                      <CheckCircle size={20} color="#10B981" />
                    ) : (
                      <XCircle size={20} color="#EF4444" />
                    )}
                    <span>Q {idx + 1}</span>
                  </div>
                  <div className="answer-question">{answer.question}</div>
                  <div className="expand-icon">
                    {expandedQuestion === idx ? '−' : '+'}
                  </div>
                </div>

                {expandedQuestion === idx && (
                  <div className="answer-details">
                    <div className="your-answer">
                      <strong>Your Answer:</strong>
                      <p>
                        {Array.isArray(answer.userAnswer) 
                          ? answer.userAnswer.join(', ') 
                          : answer.userAnswer}
                      </p>
                    </div>
                    {!answer.isCorrect && (
                      <div className="correct-answer">
                        <strong>Correct Answer:</strong>
                        <p>
                          {Array.isArray(answer.correctAnswer)
                            ? answer.correctAnswer.join(', ')
                            : answer.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={() => navigate('/dashboard')} className="btn-home">
            <Home size={20} />
            Back to Dashboard
          </button>
          <button onClick={() => navigate(`/quiz/${attempt.quizId}`)} className="btn-retry">
            <RotateCcw size={20} />
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
