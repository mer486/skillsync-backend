// routes/careerRoutes.js

const express = require('express');
const router = express.Router();

const careerController = require('../controllers/careerController');
const progressController = require('../controllers/progressController');
const { auth } = require('../middleware/authMiddleware');
const { restrictToRole, allowRoles } = require('../middleware/roleMiddleware'); // ✅ Correct import

// Routes
router.post('/select', auth, restrictToRole('student'), careerController.selectCareer);
router.get('/roadmap', auth, careerController.getRoadmap);
router.get('/courses', auth, careerController.getCourses);
router.get('/suggestions', auth, careerController.suggestCareers);
router.get('/progress', auth, progressController.getProgress);

module.exports = router;
