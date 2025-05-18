const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const roadmapController = require('../controllers/roadmapController');
const User = require('../models/User');
const roadmaps = require('../data/roadmaps');

router.get('/my', auth, roadmapController.getRoadmapForUser); // ✅ Add this route


// ✅ GET /api/roadmap - return steps based on user's selected career
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.career) {
      return res.status(400).json({ message: 'User has not selected a career yet' });
    }

    const roadmap = roadmaps[user.career.toLowerCase()];
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found for this career' });
    }

    res.json({ steps: roadmap.steps });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load roadmap', error: error.message });
  }
});

module.exports = router;
