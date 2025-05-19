const User = require('../models/User');
const courses = require('../data/careerCourses');

exports.getCoursesForCareer = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.career) {
      return res.status(400).json({ message: 'User has not selected a career' });
    }

    const userCareer = user.career.toLowerCase();
    const matchedCourses = courses[userCareer];

    if (!matchedCourses) {
      return res.status(404).json({ message: 'No courses found for this career' });
    }

    res.json({ career: userCareer, courses: matchedCourses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};
