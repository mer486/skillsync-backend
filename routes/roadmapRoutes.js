const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const roadmapController = require('../controllers/roadmapController');

router.get('/my', auth, roadmapController.getRoadmapForUser); // ✅ Add this route

module.exports = router;
