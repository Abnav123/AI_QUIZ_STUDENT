# 🎓 AI Quiz Student Portal

A modern, full-stack web application that allows students to take AI-generated quizzes from a shared MongoDB database and track their individual performance across subjects and quiz types.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Installation & Setup](#installation--setup)
6. [Running the Application](#running-the-application)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [Usage Guide](#usage-guide)
10. [Screenshots & Features Description](#screenshots--features-description)

---

## 🎯 Overview

The **AI Quiz Student Portal** is a complementary application to the AI Quiz Creator platform. While the creator system generates and manages quizzes, this student portal provides:

- ✅ **User Authentication** - Secure login/signup with JWT tokens
- ✅ **Quiz Taking Interface** - Interactive platform to answer quizzes
- ✅ **Score Tracking** - Automatic scoring with detailed feedback
- ✅ **Performance Analytics** - Comprehensive dashboard showing progress across subjects
- ✅ **Private Performance Data** - Each user sees only their own stats
- ✅ **Class Comparison** - See how you perform relative to classmates
- ✅ **Multiple Quiz Types** - Support for MCQ, True/False, Short Answer, Multiple Response

---

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - UI library
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons
- **CSS3** - Styling with gradients and animations

### **Backend**
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database (shared with AI_Quiz)
- **Mongoose** - ODM
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing

### **Infrastructure**
- **Localhost:5001** - Backend server
- **Localhost:3000** - Frontend application
- **MongoDB Atlas** - Cloud database (shared)

---

## 📁 Project Structure

```
AI_QUIZ_STUDENT/
├── backend/
│   ├── models/
│   │   ├── User.js              # Student user schema
│   │   ├── QuizAttempt.js       # Quiz submission & scores
│   │   └── PublishedQuiz.js     # Reference to AI_Quiz quizzes
│   ├── routes/
│   │   ├── auth.js              # Login/signup
│   │   ├── quizzes.js           # Quiz fetching
│   │   ├── attempts.js          # Quiz submissions
│   │   └── performance.js       # Analytics endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── server.js                # Express setup
│   ├── package.json
│   └── .env                     # Environment variables
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js         # Login page
    │   │   ├── Signup.js        # Registration page
    │   │   ├── Dashboard.js     # Quiz list & selection
    │   │   ├── Quiz.js          # Quiz taking interface
    │   │   ├── Result.js        # Results & feedback
    │   │   ├── Performance.js   # Analytics dashboard
    │   │   └── *.css            # Styling
    │   ├── components/          # Reusable components
    │   ├── api.js               # Axios setup
    │   ├── App.js               # Main app with routing
    │   ├── index.js             # React entry point
    │   └── index.css            # Global styles
    └── package.json
```

---

## ✨ Features

### **1. User Authentication**
- **Sign Up** - Create new student account with name, email, password
- **Login** - Secure JWT-based authentication
- **Session Management** - Token stored in localStorage
- **Auto-logout** - Session persists across browser refreshes

### **2. Quiz Dashboard**
- **Browse Quizzes** - View all available quizzes from AI_Quiz database
- **Filter by Subject** - Organize quizzes by subject area
- **Quiz Info** - See quiz type (MCQ/True-False/Short Answer/Multiple Response)
- **Quick Start** - One-click access to take any quiz

### **3. Quiz Taking**
- **4 Question Types**:
  - MCQ (single selection)
  - True/False (binary choice)
  - Short Answer (text input)
  - Multiple Response (multiple selections)
- **Question Navigation** - Jump to any question using number dots
- **Time Tracking** - Real-time timer showing quiz duration
- **Progress Bar** - Visual indication of completion
- **Auto-save** - Answers saved locally as you progress
- **Submit & Review** - Final submission with confirmation

### **4. Results & Feedback**
- **Score Display** - Percentage score with visual feedback
- **Performance Metrics** - Total/correct answers, accuracy
- **Answer Review** - See all questions with your answers vs correct answers
- **Attempt Details** - Time spent, subject, quiz type
- **Actions** - Retake quiz or return to dashboard

### **5. Performance Analytics**
- **Overall Stats**:
  - Total quizzes attempted
  - Average score across all attempts
  - Total correct answers
  - Best performing subject
  
- **Performance by Subject**:
  - Subject-wise average scores
  - Number of attempts per subject
  - Quiz breakdowns within each subject
  - Attempt history with scores

- **Performance by Quiz Type**:
  - Breakdown by MCQ, True/False, etc.
  - Success rates for each type
  - Trend analysis

- **Class Comparison**:
  - Your average vs class average
  - Above/Below average indicator
  - Performance ranking

- **Recent Attempts**:
  - Last 5 quiz submissions
  - Scores and timestamps
  - Quick access to retake

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### **Step 1: Clone & Navigate**
```bash
cd d:\3-2\Devops\AI_QUIZ_STUDENT
```

### **Step 2: Backend Setup**

```bash
cd backend
npm install
```

**Configure `.env`:**
```env
MONGODB_URI=mongodb+srv://peddapalliabhinav_db_user:21cGluasx2G2MFnO@cluster0.am0xoe1.mongodb.net/AI_Quiz_DB?appName=Cluster0
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=5001
NODE_ENV=development
```

### **Step 3: Frontend Setup**

```bash
cd ../frontend
npm install
```

**Create `.env` in frontend root (optional):**
```env
REACT_APP_API_URL=http://localhost:5001/api
```

---

## ▶️ Running the Application

### **Command 1: Start Backend**
```bash
cd backend
npm start
# Server will run on http://localhost:5001
```

### **Command 2: Start Frontend (in new terminal)**
```bash
cd frontend
npm start
# App will open at http://localhost:3000
```

### **Development Mode**
```bash
# Backend with auto-reload
npm run dev

# Frontend (React auto-reloads with changes)
npm start
```

---

## 🔌 API Endpoints

### **Authentication Routes** (`/api/auth`)

#### POST /signup
Create new student account
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "enrollmentNumber": "E123456"
  }'
```

#### POST /login
Student login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### GET /me
Get current user profile (requires auth)
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/auth/me
```

---

### **Quiz Routes** (`/api/quizzes`)

#### GET /all
Get all published quizzes
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/quizzes/all
```

#### GET /by-subject
Get quizzes grouped by subject
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/quizzes/by-subject
```

#### GET /:id
Get specific quiz with questions
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/quizzes/507f1f77bcf86cd799439011
```

---

### **Attempt Routes** (`/api/attempts`)

#### POST /submit
Submit quiz answers and get score
```bash
curl -X POST http://localhost:5001/api/attempts/submit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "quizId": "507f1f77bcf86cd799439011",
    "answers": ["Option A", "True", "Paris", ["Array", "Stack"]],
    "timeSpent": 300
  }'
```

#### GET /user/attempts
Get all user attempts
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/attempts/user/attempts
```

#### GET /user/attempt/:id
Get specific attempt details
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/attempts/user/attempt/507f1f77bcf86cd799439015
```

#### GET /quiz/:quizId
Get all attempts for specific quiz
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/attempts/quiz/507f1f77bcf86cd799439011
```

---

### **Performance Routes** (`/api/performance`)

#### GET /dashboard
Overall performance dashboard
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/performance/dashboard
```

**Response:**
```json
{
  "totalAttempts": 15,
  "averageScore": 78,
  "totalCorrect": 142,
  "totalQuestions": 182,
  "bySubject": {
    "Biology": {
      "subject": "Biology",
      "attempts": 5,
      "averageScore": 82,
      "totalCorrect": 45,
      "totalQuestions": 55
    }
  },
  "byQuizType": {
    "MCQ": {
      "type": "MCQ",
      "attempts": 10,
      "averageScore": 80
    }
  },
  "recentAttempts": [...]
}
```

#### GET /subject/:subject
Get performance for specific subject
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/performance/subject/Biology
```

#### GET /class-average
Compare with class average
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/performance/class-average
```

---

## 💾 Database Schema

### **User Collection**

```javascript
{
  _id: ObjectId,
  name: String,                    // Full name
  email: String (unique),          // Email address
  password: String (hashed),       // Bcrypt password
  enrollmentNumber: String,        // Optional student ID
  createdAt: Date                  // Account creation date
}
```

### **QuizAttempt Collection**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),    // Student who took quiz
  quizId: ObjectId,                // Reference to PublishedQuiz
  quizTitle: String,               // Quiz name
  quizType: String,                // MCQ, true/false, short answer, multiple response
  subject: String,                 // Subject area
  answers: [
    {
      questionIndex: Number,
      question: String,
      userAnswer: String|Array,    // Student's answer(s)
      correctAnswer: String|Array, // Correct answer(s)
      isCorrect: Boolean           // Auto-evaluated
    }
  ],
  totalQuestions: Number,          // Total questions in quiz
  correctAnswers: Number,          // Number of correct responses
  score: Number,                   // Percentage (0-100)
  timeSpent: Number,               // Seconds
  attemptedAt: Date                // When quiz was submitted
}
```

### **PublishedQuiz Collection** (from AI_Quiz DB)

```javascript
{
  _id: ObjectId,
  title: String,
  subject: String,
  type: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
      correctAnswers: [String]
    }
  ],
  publishedAt: Date
}
```

---

## 👥 Usage Guide

### **For Students**

#### 1. **Get Started**
- Go to http://localhost:3000
- Click "Sign Up" or login if you have an account
- Fill in your details (name, email, enrollment number optional)
- Password must be at least 6 characters

#### 2. **Take a Quiz**
- Go to Dashboard after login
- Browse available quizzes or filter by subject
- Click "Take Quiz" on any quiz
- Read and answer each question carefully
- Use navigation dots to jump between questions
- Click "Submit Quiz" on the last question
- Review your results immediately

#### 3. **View Performance**
- Click "Performance" in the header
- See overall stats (total attempts, average score, etc.)
- View performance by subject - click any subject for details
- Check performance by quiz type
- Compare your score with class average
- See recent quiz attempts

#### 4. **Improve Your Scores**
- Review answer feedback after each quiz
- Take the same quiz multiple times to improve
- Focus on weak subjects using the analytics
- Track improvement across attempts

---

## 🎨 Screenshots & Features Description

### **Login Page**
- Clean, modern gradient design
- Email and password fields
- Signup link for new users
- Error messages for invalid credentials

### **Dashboard**
- Personalized greeting with user name
- Tab navigation by subject
- Quiz cards showing:
  - Quiz title
  - Quiz type badge with emoji
  - Subject area
  - "Take Quiz" button
- Responsive grid layout

### **Quiz Taking Interface**
- Question number and type display
- Progress bar showing completion
- Timer showing elapsed time
- Question navigation with dot indicators
- Type-specific answer interfaces:
  - MCQ: Radio button options
  - True/False: Large toggle buttons
  - Short Answer: Text textarea
  - Multiple Response: Checkboxes
- Previous/Next navigation
- Submit Quiz button on final question

### **Results Page**
- Large score display (% with color coding)
- Performance indicator (Excellent/Good/Keep Practicing)
- Stats grid (Correct answers, Score, Type, Subject)
- Expandable answer review showing:
  - Your answer
  - Correct answer (if wrong)
  - Visual indicators (✓/✗)
- Buttons to retry or return to dashboard

### **Performance Dashboard**
- **Stats Cards**: Total attempts, avg score, correct answers, best subject
- **Class Comparison**: Your score vs class average with bar charts
- **Performance by Type**: Breakdown by quiz type
- **Performance by Subject**: Interactive subject cards
- **Subject Details**: Quizzes within each subject with attempt timeline
- **Recent Attempts**: Last 5 quiz submissions with scores

---

## 🔐 Security Features

- **Password Hashing** - bcryptjs with salt
- **JWT Authentication** - Secure token-based auth
- **Protected Routes** - Frontend checks for valid token
- **Server-side Validation** - All API endpoints verify auth
- **Private Data** - Users only see their own performance
- **CORS Enabled** - Secure cross-origin requests

---

## 📊 Performance Metrics

The system automatically tracks:
- **Accuracy** - % of correct answers
- **Speed** - Time spent on each quiz
- **Consistency** - Performance across attempts
- **Subject Strengths** - Which subjects you excel in
- **Progress** - Improvement over time
- **Comparison** - Performance relative to peers

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5001 is in use
# Kill the process or change PORT in .env
```

### MongoDB connection error
```bash
# Verify MongoDB URI in .env is correct
# Check if MongoDB Atlas IP whitelist includes your IP
```

### Frontend can't connect to backend
```bash
# Ensure backend is running on port 5001
# Check API.js has correct baseURL
# Verify CORS is enabled in backend
```

### Answers not saving
```bash
# Make sure you're logged in (token in localStorage)
# Check browser console for API errors
# Verify quiz data is not null
```

---

## 🚀 Future Enhancements

- [ ] Email verification for signup
- [ ] Password reset functionality
- [ ] Student groups/classroom management
- [ ] Quiz difficulty levels
- [ ] Image support in questions
- [ ] Timed quiz mode with auto-submit
- [ ] Question randomization
- [ ] Export results as PDF
- [ ] Leaderboards
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Question explanations/hints

---

## 📞 Support

For issues or questions:
1. Check the API endpoints documentation
2. Review browser console for errors
3. Verify .env configurations
4. Check MongoDB connection status
5. Ensure both frontend and backend are running

---

**Version:** 1.0.0  
**Last Updated:** April 6, 2026  
**Status:** ✅ Production Ready
