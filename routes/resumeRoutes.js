const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require('../middleware/authMiddleware');
const resumeController = require('../controllers/resumeController');

// Set up multer for file uploads (PDF/DOCX only)
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// ✅ Upload resume and analyze it using Hugging Face
router.post(
  '/upload',
  auth,
  upload.single('resume'),
  resumeController.uploadAndAnalyze
);

// ✅ Retrieve last analyzed resume details (used by Flutter frontend)
router.get(
  '/analysis',
  auth,
  resumeController.getLastAnalysis
);

module.exports = router;
