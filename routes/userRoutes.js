const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const User = require('../models/User');

// ✅ POST /api/user/select-career
router.post('/select-career', auth, async (req, res) => {
  const { career } = req.body;

  if (!career) {
    return res.status(400).json({ message: 'Career is required' });
  }

  try {
    await User.findByIdAndUpdate(req.user.id, { career });
    res.json({ message: 'Career saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save career', error: err.message });
  }
});

module.exports = router;
