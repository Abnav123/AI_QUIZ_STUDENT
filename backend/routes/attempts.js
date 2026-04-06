const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const QuizAttempt = require('../models/QuizAttempt');
const PublishedQuiz = require('../models/PublishedQuiz');

// Submit quiz attempt
router.post('/submit', auth, async (req, res) => {
  try {
    const { quizId, answers, timeSpent } = req.body;
    const email = req.email;

    // Fetch the published quiz to get correct answers
    const quiz = await PublishedQuiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Find user
    const User = require('../models/User');
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Calculate score
    let correctCount = 0;
    const scoredAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      let isCorrect = false;

      // Check answer based on quiz type
      if (quiz.type === 'MCQ' || quiz.type === 'true/false' || quiz.type === 'short answer') {
        isCorrect = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
      } else if (quiz.type === 'multiple response') {
        // For multiple response, check if arrays match
        const userAnswersSet = new Set(Array.isArray(answer) ? answer.map(a => a.trim().toLowerCase()) : [answer.trim().toLowerCase()]);
        const correctAnswersSet = new Set(question.correctAnswers.map(a => a.trim().toLowerCase()));

        isCorrect = userAnswersSet.size === correctAnswersSet.size &&
          [...userAnswersSet].every(item => correctAnswersSet.has(item));
      }

      if (isCorrect) {
        correctCount++;
      }

      return {
        questionIndex: index,
        question: question.question,
        userAnswer: answer,
        correctAnswer: quiz.type === 'multiple response' ? question.correctAnswers : question.correctAnswer,
        isCorrect
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);

    // Save attempt
    const attempt = new QuizAttempt({
      userEmail: email,
      quizId,
      quizTitle: quiz.title,
      quizType: quiz.type,
      subject: quiz.subject,
      answers: scoredAnswers,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      score,
      timeSpent
    });

    await attempt.save();

    res.status(201).json({
      message: 'Quiz submitted successfully',
      attempt: {
        _id: attempt._id,
        score: attempt.score,
        correctAnswers: attempt.correctAnswers,
        totalQuestions: attempt.totalQuestions,
        answers: attempt.answers
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quiz', error: error.message });
  }
});

// Get all attempts for current user
router.get('/user/attempts', auth, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userEmail: req.email })
      .sort({ attemptedAt: -1 });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempts', error: error.message });
  }
});

// Get specific attempt
router.get('/user/attempt/:id', auth, async (req, res) => {
  try {
    const attempt = await QuizAttempt.findOne({
      _id: req.params.id,
      userEmail: req.email
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempt', error: error.message });
  }
});

// Get attempts for specific quiz
router.get('/quiz/:quizId', auth, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      userEmail: req.email,
      quizId: req.params.quizId
    }).sort({ attemptedAt: -1 });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz attempts', error: error.message });
  }
});

module.exports = router;
