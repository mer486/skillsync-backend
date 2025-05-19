const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.post('/select-career', auth, async (req, res) => {
  const { career } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { career },
      { new: true }
    );
    res.json({ message: 'Career saved', career: user.career });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save career', error: err.message });
  }
});

module.exports = router;
