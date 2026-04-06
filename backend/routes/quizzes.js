const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import both published quiz models
const PublishedQuiz = require('../models/PublishedQuiz');

// Get all published quizzes
router.get('/all', auth, async (req, res) => {
  try {
    const quizzes = await PublishedQuiz.find().select('-questions');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
  }
});

// Get quizzes by subject
router.get('/by-subject', auth, async (req, res) => {
  try {
    const quizzes = await PublishedQuiz.find().select('_id title subject type publishedAt');
    
    // Group by subject
    const groupedBySubject = {};
    quizzes.forEach(quiz => {
      if (!groupedBySubject[quiz.subject]) {
        groupedBySubject[quiz.subject] = [];
      }
      groupedBySubject[quiz.subject].push(quiz);
    });

    res.json(groupedBySubject);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
  }
});

// Get specific quiz with questions
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await PublishedQuiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Return quiz without correct answers
    const quizWithoutAnswers = {
      _id: quiz._id,
      title: quiz.title,
      subject: quiz.subject,
      type: quiz.type,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options
        // Don't include correct answers
      }))
    };

    res.json(quizWithoutAnswers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz', error: error.message });
  }
});

module.exports = router;
