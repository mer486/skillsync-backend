// routes/resumeRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require('../middleware/authMiddleware');
const resumeController = require('../controllers/resumeController');

// Multer config
const upload = multer({ dest: 'uploads/' });

// POST /api/resume/upload
router.post(
  '/upload',
  auth,
  upload.single('resume'),
  resumeController.uploadAndAnalyze
);

// GET /api/resume/analysis
router.get(
  '/analysis',
  auth,
  resumeController.getLastAnalysis
);

module.exports = router;
