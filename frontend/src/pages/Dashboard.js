import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, LogOut, BarChart3, Play } from 'lucide-react';
import API from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (userName) {
      setUser({ name: userName });
    }
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await API.get('/quizzes/by-subject');
      setQuizzes(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load quizzes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getQuizTypeColor = (type) => {
    const colors = {
      'MCQ': '#3B82F6',
      'true/false': '#F59E0B',
      'short answer': '#8B5CF6',
      'multiple response': '#10B981'
    };
    return colors[type] || '#6B7280';
  };

  const getQuizTypeIcon = (type) => {
    const icons = {
      'MCQ': '📋',
      'true/false': '✓✗',
      'short answer': '✏️',
      'multiple response': '☑️'
    };
    return icons[type] || '📝';
  };

  const subjects = Object.keys(quizzes);
  const allQuizzes = Object.values(quizzes).flat();

  const displayQuizzes = activeTab === 'all' ? allQuizzes : quizzes[activeTab] || [];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <BookOpen size={32} />
            <h1>AI Quiz Student Portal</h1>
          </div>
          <div className="header-right">
            <span className="welcome-text">Welcome, {user?.name}!</span>
            <Link to="/performance" className="btn-secondary" title="View Performance">
              <BarChart3 size={20} />
              Performance
            </Link>
            <button onClick={handleLogout} className="btn-logout" title="Logout">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <h2>Select a Quiz to Get Started</h2>
            <p>Choose from available quizzes across different subjects and test your knowledge</p>
          </section>

          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Quizzes
            </button>
            {subjects.map(subject => (
              <button
                key={subject}
                className={`tab ${activeTab === subject ? 'active' : ''}`}
                onClick={() => setActiveTab(subject)}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* Quizzes Grid */}
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading quizzes...</p>
            </div>
          ) : error ? (
            <div className="error-box">
              <p>{error}</p>
              <button onClick={fetchQuizzes} className="btn-primary">
                Retry
              </button>
            </div>
          ) : displayQuizzes.length === 0 ? (
            <div className="empty-state">
              <p>No quizzes available</p>
              <button onClick={fetchQuizzes} className="btn-primary">
                Refresh
              </button>
            </div>
          ) : (
            <div className="quizzes-grid">
              {displayQuizzes.map(quiz => (
                <div key={quiz._id} className="quiz-card">
                  <div className="quiz-header">
                    <h3>{quiz.title}</h3>
                    <span className="quiz-type" style={{ backgroundColor: getQuizTypeColor(quiz.type) }}>
                      {getQuizTypeIcon(quiz.type)} {quiz.type}
                    </span>
                  </div>
                  <div className="quiz-info">
                    <p><strong>Subject:</strong> {quiz.subject}</p>
                  </div>
                  <Link to={`/quiz/${quiz._id}`} className="btn-take-quiz">
                    <Play size={18} />
                    Take Quiz
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
