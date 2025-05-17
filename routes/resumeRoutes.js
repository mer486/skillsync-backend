const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require('../middleware/authMiddleware');
const resumeController = require('../controllers/resumeController');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// ✅ Upload resume and analyze
router.post(
  '/upload',
  auth,
  upload.single('resume'),
  resumeController.uploadAndAnalyze
);

// ✅ New: Get last analyzed resume data
router.get(
  '/analysis',
  auth,
  resumeController.getLastAnalysis
);

module.exports = router;
