const roadmaps = require('../data/roadmaps');
const User = require('../models/User');

exports.getRoadmapForUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.career) {
      return res.status(404).json({ message: 'User career not set' });
    }

    const roadmap = roadmaps[user.career.toLowerCase()];
    if (!roadmap) {
      return res.status(404).json({ message: 'No roadmap found for this career' });
    }

    res.json({ career: user.career, steps: roadmap.steps });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get roadmap', error: error.message });
  }
};
