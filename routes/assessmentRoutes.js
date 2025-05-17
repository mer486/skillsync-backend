// routes/assessmentRoutes.js

const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { auth } = require('../middleware/authMiddleware');

const questions = require('../data/assessmentQuestions');

// GET available assessment questions
router.get('/questions', auth, (req, res) => {
  res.json({ questions });
});

// ✅ Routes
router.post('/submit', auth, assessmentController.submitAssessment);
router.get('/history', auth, assessmentController.getAssessmentHistory);

module.exports = router;
