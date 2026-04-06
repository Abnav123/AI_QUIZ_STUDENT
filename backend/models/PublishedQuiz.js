const mongoose = require('mongoose');

const publishedQuizSchema = new mongoose.Schema({
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
}, { collection: 'publishedquizzes' });

module.exports = mongoose.model('PublishedQuiz', publishedQuizSchema);
