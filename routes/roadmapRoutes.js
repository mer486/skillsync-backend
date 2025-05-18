const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const User = require('../models/User');
const roadmaps = require('../data/roadmaps');

// ✅ GET /api/roadmap — return roadmap steps for the logged-in user’s selected career
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.career) {
      return res.status(400).json({ message: 'No career selected for this user' });
    }

    const selectedCareer = user.career.toLowerCase();
    const roadmap = roadmaps[selectedCareer];

    if (!roadmap) {
      return res.status(404).json({ message: 'No roadmap found for selected career' });
    }

    res.json({ steps: roadmap.steps });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch roadmap', error: error.message });
  }
});

module.exports = router;
