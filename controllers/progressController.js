const Progress = require('../models/Progress');
const roadmaps = require('../data/roadmaps');
const User = require('../models/User');

// ✅ Update user roadmap progress (merging new steps with existing ones)
exports.updateProgress = async (req, res) => {
  const userId = req.user.id;
  const { completedSteps } = req.body;

  try {
    const user = await User.findById(userId);
    const career = user?.career;

    if (!career) {
      return res.status(400).json({ message: 'User has not selected a career yet' });
    }

    let progress = await Progress.findOne({ user: userId });

    if (!progress) {
      progress = new Progress({ user: userId, roadmap: career, completedSteps });
    } else {
      const allSteps = new Set([...progress.completedSteps, ...completedSteps]);
      progress.completedSteps = Array.from(allSteps);
      progress.updatedAt = Date.now();
    }

    await progress.save();
    res.json({ message: 'Progress updated successfully', progress });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update progress', error: error.message });
  }
};

// ✅ Get progress and roadmap visual status
exports.getProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const career = user?.career;

    if (!career) {
      return res.status(400).json({ message: 'User has not selected a career yet' });
    }

    const roadmapData = roadmaps[career.toLowerCase()];
    if (!roadmapData || !roadmapData.steps) {
      return res.status(404).json({ message: `No roadmap found for career: ${career}` });
    }

    const roadmapSteps = roadmapData.steps;
    const progress = await Progress.findOne({ user: userId });
    const completed = progress?.completedSteps || [];

    const status = roadmapSteps.map((step, index) => ({
      index,
      step,
      completed: completed.includes(index)
    }));

    res.json({
      career,
      totalSteps: roadmapSteps.length,
      completedSteps: completed.length,
      progressPercentage: Math.round((completed.length / roadmapSteps.length) * 100),
      status
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch progress', error: error.message });
  }
};
