const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, subscription, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      subscription,
      role
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};


exports.setCareer = async (req, res) => {
  const { career } = req.body;

  if (!career) {
    return res.status(400).json({ message: 'Career is required' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { career },
      { new: true }
    );

    res.status(200).json({
      message: 'Career set successfully',
      user: {
        id: user._id,
        email: user.email,
        career: user.career,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to set career', error: error.message });
  }
};


// POST /api/user/select-career
exports.selectCareer = async (req, res) => {
  const userId = req.user.id;
  const { career } = req.body;

  if (!career) {
    return res.status(400).json({ message: 'Career is required' });
  }

  try {
    await User.findByIdAndUpdate(userId, { career });
    res.json({ message: 'Career selected successfully', career });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save career', error: error.message });
  }
};

