const User = require('../models/User');
const careerCourses = require('../data/careerCourses');

exports.getCoursesForCareer = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.career) {
      return res.status(404).json({ message: 'User has not selected a career' });
    }

    const courses = careerCourses[user.career.toLowerCase()];
    if (!courses) {
      return res.status(404).json({ message: 'No courses found for this career' });
    }

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};
