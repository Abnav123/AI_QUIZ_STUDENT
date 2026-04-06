const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
    // Reference to quiz from AI_Quiz DB
  },
  quizTitle: {
    type: String,
    required: true
  },
  quizType: {
    type: String,
    enum: ['MCQ', 'short answer', 'true/false', 'multiple response'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  answers: [
    {
      questionIndex: Number,
      question: String,
      userAnswer: mongoose.Schema.Types.Mixed, // Can be string or array
      correctAnswer: mongoose.Schema.Types.Mixed,
      isCorrect: Boolean
    }
  ],
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
    // Score as percentage
  },
  timeSpent: {
    type: Number
    // in seconds
  },
  attemptedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
