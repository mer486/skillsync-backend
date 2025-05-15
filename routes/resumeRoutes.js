// routes/resumeRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { restrictToRole } = require('../middleware/roleMiddleware');
const resumeController = require('../controllers/resumeController');
const { auth } = require('../middleware/authMiddleware');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// ✅ Only students can upload
router.post(
  '/upload',
  auth,
  restrictToRole('student'),
  upload.single('resume'),
  resumeController.uploadAndAnalyze
);

module.exports = router;
