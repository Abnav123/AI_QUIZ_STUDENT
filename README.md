# 🎓 AI Quiz Student Portal

> **Student learning platform for taking AI-generated quizzes and tracking performance**

**🌐 Live Site:** https://ai-quiz-student-frontend.onrender.com

---

## 📖 Overview

AI Quiz Student Portal is a full-stack web application where students can take AI-generated quizzes, track their performance, and compare scores with classmates. Built with MERN stack and designed for seamless learning experience.

### ✨ Key Features
- ✅ **User Authentication** - Secure login/signup with email and password
- 📝 **Quiz Taking** - Interactive platform to answer quizzes with 4 question types
- 📊 **Score Tracking** - Automatic scoring with detailed feedback
- 📈 **Performance Analytics** - Comprehensive dashboard showing progress across subjects
- 👥 **Class Comparison** - See how you perform relative to classmates
- 🎨 **Modern UI** - Beautiful gradient design with responsive layout

---

## 🛠️ Technology Stack

### Frontend
- React 18
- React Router v6
- Axios
- Lucide React Icons
- CSS3 with gradients

### Backend
- Node.js + Express
- MongoDB Atlas
- Mongoose ODM
- Email/Password Authentication

---

## 📂 Project Structure

```
AI_QUIZ_STUDENT/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── QuizAttempt.js
│   │   └── PublishedQuiz.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── quizzes.js
│   │   ├── attempts.js
│   │   └── performance.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── Dashboard.js
    │   │   ├── Quiz.js
    │   │   ├── Result.js
    │   │   └── Performance.js
    │   ├── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/DB_NAME
PORT=5001
NODE_ENV=development
EOF

npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 🔐 Authentication

User authentication using **email and password**:

1. **Sign Up** - Create account with name, email, password
2. **Login** - Authenticate with email and password
3. **Store Email** - Email saved in browser's localStorage
4. **API Requests** - Email sent as header in all authenticated requests

---

## 📚 Features

### 1. Quiz Taking
- Browse available quizzes
- Answer 4 question types: MCQ, True/False, Short Answer, Multiple Response
- Real-time score calculation
- Immediate feedback with correct answers

### 2. Performance Analytics
- **Overall Stats**: Total attempts, average score, correct answers
- **By Subject**: Performance breakdown by subject area
- **By Quiz Type**: Success rates for each question type
- **Class Comparison**: Your score vs class average
- **Attempt History**: Recent quiz submissions with scores

### 3. Dashboard
- View all available quizzes
- Filter by subject
- One-click access to take any quiz
- See quiz type and question count

---

## 🔌 API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - Register new student
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user profile

### Quiz Routes
- `GET /api/quizzes/all` - Get all published quizzes
- `GET /api/quizzes/by-subject` - Get quizzes grouped by subject
- `GET /api/quizzes/:id` - Get specific quiz with questions

### Attempt Routes
- `POST /api/attempts/submit` - Submit quiz answers
- `GET /api/attempts/user/attempts` - Get all user attempts
- `GET /api/attempts/user/attempt/:id` - Get specific attempt details

### Performance Routes
- `GET /api/performance/dashboard` - Overall performance stats
- `GET /api/performance/subject/:subject` - Performance for specific subject
- `GET /api/performance/class-average` - Compare with class average

---

## 🔄 Workflow

1. **Sign Up** - Create student account
2. **Login** - Enter credentials and login
3. **Dashboard** - Browse available quizzes
4. **Take Quiz** - Select and answer questions
5. **Submit** - Get instant score and feedback
6. **View Performance** - Check analytics and progress
7. **Retake** - Take same quiz again to improve

---

## 🌐 Live Deployment

- **Frontend:** https://ai-quiz-student-frontend.onrender.com
- **Backend:** https://ai-quiz-student-backend.onrender.com

---

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/DB_NAME
PORT=5001
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=https://ai-quiz-student-backend.onrender.com
```

---

## Version
v1.0.0 - April 2026 | Status: ✅ Production Ready
