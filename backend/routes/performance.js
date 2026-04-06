const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const QuizAttempt = require('../models/QuizAttempt');

// Get overall performance dashboard
router.get('/dashboard', auth, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userEmail: req.email });

    if (attempts.length === 0) {
      return res.json({
        totalAttempts: 0,
        averageScore: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        bySubject: {},
        byQuizType: {},
        recentAttempts: []
      });
    }

    // Calculate overall stats
    const totalAttempts = attempts.length;
    const totalCorrect = attempts.reduce((sum, a) => sum + a.correctAnswers, 0);
    const totalQuestions = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
    const averageScore = Math.round(
      attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts
    );

    // Performance by subject
    const bySubject = {};
    attempts.forEach(attempt => {
      if (!bySubject[attempt.subject]) {
        bySubject[attempt.subject] = {
          subject: attempt.subject,
          attempts: 0,
          averageScore: 0,
          totalScore: 0,
          totalCorrect: 0,
          totalQuestions: 0
        };
      }
      bySubject[attempt.subject].attempts += 1;
      bySubject[attempt.subject].totalScore += attempt.score;
      bySubject[attempt.subject].totalCorrect += attempt.correctAnswers;
      bySubject[attempt.subject].totalQuestions += attempt.totalQuestions;
    });

    // Calculate averages for subjects
    Object.keys(bySubject).forEach(subject => {
      bySubject[subject].averageScore = Math.round(
        bySubject[subject].totalScore / bySubject[subject].attempts
      );
    });

    // Performance by quiz type
    const byQuizType = {};
    attempts.forEach(attempt => {
      if (!byQuizType[attempt.quizType]) {
        byQuizType[attempt.quizType] = {
          type: attempt.quizType,
          attempts: 0,
          averageScore: 0,
          totalScore: 0
        };
      }
      byQuizType[attempt.quizType].attempts += 1;
      byQuizType[attempt.quizType].totalScore += attempt.score;
    });

    // Calculate averages for quiz types
    Object.keys(byQuizType).forEach(type => {
      byQuizType[type].averageScore = Math.round(
        byQuizType[type].totalScore / byQuizType[type].attempts
      );
    });

    // Recent attempts
    const recentAttempts = attempts.slice(0, 5);

    res.json({
      totalAttempts,
      averageScore,
      totalCorrect,
      totalQuestions,
      bySubject,
      byQuizType,
      recentAttempts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance data', error: error.message });
  }
});

// Get performance by subject
router.get('/subject/:subject', auth, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      userEmail: req.email,
      subject: req.params.subject
    }).sort({ attemptedAt: -1 });

    if (attempts.length === 0) {
      return res.json({
        subject: req.params.subject,
        totalAttempts: 0,
        averageScore: 0,
        quizzes: []
      });
    }

    // Group by quiz
    const quizzes = {};
    attempts.forEach(attempt => {
      if (!quizzes[attempt.quizTitle]) {
        quizzes[attempt.quizTitle] = {
          quizTitle: attempt.quizTitle,
          quizId: attempt.quizId,
          quizType: attempt.quizType,
          bestScore: attempt.score,
          attempts: 0,
          averageScore: 0,
          totalScore: 0,
          allAttempts: []
        };
      }
      quizzes[attempt.quizTitle].attempts += 1;
      quizzes[attempt.quizTitle].totalScore += attempt.score;
      quizzes[attempt.quizTitle].bestScore = Math.max(quizzes[attempt.quizTitle].bestScore, attempt.score);
      quizzes[attempt.quizTitle].allAttempts.push({
        _id: attempt._id,
        score: attempt.score,
        correctAnswers: attempt.correctAnswers,
        totalQuestions: attempt.totalQuestions,
        attemptedAt: attempt.attemptedAt
      });
    });

    Object.keys(quizzes).forEach(quiz => {
      quizzes[quiz].averageScore = Math.round(
        quizzes[quiz].totalScore / quizzes[quiz].attempts
      );
    });

    const averageScore = Math.round(
      attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
    );

    res.json({
      subject: req.params.subject,
      totalAttempts: attempts.length,
      averageScore,
      quizzes: Object.values(quizzes)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subject performance', error: error.message });
  }
});

// Get comparison with class average (mock data)
router.get('/class-average', auth, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userEmail: req.email });
    
    const userAverage = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
      : 0;

    // Mock class average - in real app, calculate from all students
    const classAverage = Math.round(userAverage * 0.9); // Mock: class is slightly behind

    res.json({
      userAverage,
      classAverage,
      difference: userAverage - classAverage,
      performance: userAverage >= classAverage ? 'Above Average' : 'Below Average'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class average', error: error.message });
  }
});

module.exports = router;
