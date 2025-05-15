const User = require('../models/User');
const Resume = require('../models/Resume'); // Optional: remove if not implemented

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

// Promote user to mentor
exports.promoteToMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'mentor';
    await user.save();

    res.json({ message: 'User promoted to mentor successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error promoting user', error: err.message });
  }
};

// Get system statistics
exports.getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const mentors = await User.countDocuments({ role: 'mentor' });
    const admins = await User.countDocuments({ role: 'admin' });

    let resumes = 0;
    if (Resume && Resume.countDocuments) {
      resumes = await Resume.countDocuments();
    }

    res.json({ totalUsers, students, mentors, admins, resumes });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};
