const express = require('express');
const router = express.Router();
const courses = require('../data/careerCourses');
const User = require('../models/User');
const { auth } = require('../middleware/authMiddleware');

// GET /api/courses
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.career) {
      return res.status(400).json({ message: 'User has not selected a career' });
    }

    const career = user.career.toLowerCase();
    const recommended = courses[career];

    if (!recommended) {
      return res.status(404).json({ message: 'No courses found for this career' });
    }

    res.json({ career, courses: recommended });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
});

module.exports = router;
