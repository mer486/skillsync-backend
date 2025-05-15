// routes/assessmentRoutes.js

const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { auth } = require('../middleware/authMiddleware');
// ✅ Routes
router.post('/submit', auth, assessmentController.submitAssessment);
router.get('/history', auth, assessmentController.getAssessmentHistory);

module.exports = router;
