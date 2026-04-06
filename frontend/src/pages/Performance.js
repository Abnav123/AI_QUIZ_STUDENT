import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Target, BookOpen, Award } from 'lucide-react';
import API from '../api';
import './Performance.css';

const Performance = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [classAverage, setClassAverage] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectDetail, setSubjectDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchSubjectDetail(selectedSubject);
    }
  }, [selectedSubject]);

  const fetchPerformanceData = async () => {
    try {
      const [dashboardRes, classRes] = await Promise.all([
        API.get('/performance/dashboard'),
        API.get('/performance/class-average')
      ]);
      setDashboard(dashboardRes.data);
      setClassAverage(classRes.data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectDetail = async (subject) => {
    try {
      const response = await API.get(`/performance/subject/${subject}`);
      setSubjectDetail(response.data);
    } catch (error) {
      console.error('Error fetching subject detail:', error);
    }
  };

  if (loading) {
    return (
      <div className="performance-container">
        <div className="loading">Loading performance data...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="performance-container">
        <div className="error">Failed to load performance data</div>
      </div>
    );
  }

  const subjects = Object.keys(dashboard.bySubject);
  const topSubject = subjects.reduce((top, subject) => {
    return dashboard.bySubject[subject].averageScore > (dashboard.bySubject[top]?.averageScore || 0) ? subject : top;
  }, subjects[0]);

  return (
    <div className="performance-container">
      {/* Header */}
      <header className="performance-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1>📊 Your Performance Analytics</h1>
      </header>

      <main className="performance-content">
        <div className="container">
          {/* Overall Stats */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#DDD6FE' }}>
                <BookOpen color="#667eea" size={32} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Quizzes Attempted</p>
                <p className="stat-value">{dashboard.totalAttempts}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#DBEAFE' }}>
                <Target color="#3B82F6" size={32} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Average Score</p>
                <p className="stat-value">{dashboard.averageScore}%</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#DCFCE7' }}>
                <Award color="#10B981" size={32} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Correct Answers</p>
                <p className="stat-value">{dashboard.totalCorrect}/{dashboard.totalQuestions}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#DBEAFE' }}>
                <TrendingUp color="#667eea" size={32} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Best Subject</p>
                <p className="stat-value">{topSubject}</p>
              </div>
            </div>
          </section>

          {/* Class Comparison */}
          {classAverage && (
            <section className="class-comparison">
              <h2>Your Performance vs Class Average</h2>
              <div className="comparison-chart">
                <div className="comparison-bar">
                  <div className="bar-label">Your Average</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill user"
                      style={{ width: `${Math.min(classAverage.userAverage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">{classAverage.userAverage}%</div>
                </div>

                <div className="comparison-bar">
                  <div className="bar-label">Class Average</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill class"
                      style={{ width: `${Math.min(classAverage.classAverage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">{classAverage.classAverage}%</div>
                </div>
              </div>
              <p className="performance-message">
                {classAverage.performance === 'Above Average' 
                  ? `🌟 You're performing ${classAverage.difference}% above the class average!`
                  : `📚 You can improve by ${Math.abs(classAverage.difference)}% to match the class average!`
                }
              </p>
            </section>
          )}

          {/* Performance by Quiz Type */}
          <section className="quiz-types">
            <h2>Performance by Quiz Type</h2>
            <div className="types-grid">
              {Object.values(dashboard.byQuizType).map((typeData) => (
                <div key={typeData.type} className="type-card">
                  <h3>{typeData.type}</h3>
                  <div className="type-stats">
                    <p><strong>Attempts:</strong> {typeData.attempts}</p>
                    <p><strong>Average Score:</strong> {typeData.averageScore}%</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Performance by Subject */}
          <section className="subjects-section">
            <h2>Performance by Subject</h2>
            <div className="subjects-grid">
              {subjects.length === 0 ? (
                <p className="no-data">No subject data available yet</p>
              ) : (
                subjects.map(subject => (
                  <button
                    key={subject}
                    className={`subject-card ${selectedSubject === subject ? 'active' : ''}`}
                    onClick={() => setSelectedSubject(selectedSubject === subject ? null : subject)}
                  >
                    <h3>{subject}</h3>
                    <div className="subject-stats">
                      <p><strong>Attempts:</strong> {dashboard.bySubject[subject].attempts}</p>
                      <p><strong>Average:</strong> <span className="score">{dashboard.bySubject[subject].averageScore}%</span></p>
                      <p><strong>Correct:</strong> {dashboard.bySubject[subject].totalCorrect}/{dashboard.bySubject[subject].totalQuestions}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>

          {/* Subject Detail */}
          {selectedSubject && subjectDetail && (
            <section className="subject-detail">
              <h2>{selectedSubject} - Detailed Breakdown</h2>
              <div className="quizzes-in-subject">
                {Object.values(subjectDetail.quizzes).map((quiz) => (
                  <div key={quiz.quizId} className="quiz-detail-card">
                    <div className="quiz-detail-header">
                      <h3>{quiz.quizTitle}</h3>
                      <span className="quiz-type-badge">{quiz.quizType}</span>
                    </div>
                    <div className="quiz-detail-stats">
                      <p><strong>Attempts:</strong> {quiz.attempts}</p>
                      <p><strong>Best Score:</strong> <span className="score">{quiz.bestScore}%</span></p>
                      <p><strong>Average Score:</strong> {quiz.averageScore}%</p>
                    </div>
                    <div className="quiz-attempts">
                      <p><strong>All Attempts:</strong></p>
                      <div className="attempts-timeline">
                        {quiz.allAttempts.map((attempt, idx) => (
                          <div key={idx} className="attempt-dot" title={`Attempt ${idx + 1}: ${attempt.score}%`} style={{
                            backgroundColor: attempt.score >= 60 ? '#10B981' : '#EF4444'
                          }}>
                            {attempt.score}%
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Attempts */}
          <section className="recent-attempts">
            <h2>Recent Attempts</h2>
            <div className="attempts-list">
              {dashboard.recentAttempts.length === 0 ? (
                <p className="no-data">No attempts yet</p>
              ) : (
                dashboard.recentAttempts.map((attempt, idx) => (
                  <div key={idx} className="attempt-item">
                    <div className="attempt-info">
                      <h3>{attempt.quizTitle}</h3>
                      <p>{attempt.subject} • {attempt.quizType}</p>
                    </div>
                    <div className="attempt-score">
                      <span className={`score-badge ${attempt.score >= 60 ? 'passed' : 'failed'}`}>
                        {attempt.score}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Performance;
