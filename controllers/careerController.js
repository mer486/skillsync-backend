

const careerMap = require('../data/careerMapping');
const Assessment = require('../models/Assessment');

exports.suggestCareers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get latest assessment answers
    const assessment = await Assessment.findOne({ user: userId }).sort({ createdAt: -1 });
    const assessmentSkills = assessment ? assessment.answers.map(ans => ans.toLowerCase()) : [];

    // Get resume keywords from user model
    const user = await User.findById(userId);
    const resumeSkills = user?.resumeKeywords || [];

    // Combine and deduplicate
    const allSkills = [...new Set([...assessmentSkills, ...resumeSkills])];

    const matchedCareers = new Set();

    allSkills.forEach(skill => {
      if (careerMap[skill]) {
        careerMap[skill].forEach(career => matchedCareers.add(career));
      }
    });

    res.json({
      source: {
        assessmentSkills,
        resumeSkills
      },
      suggestedCareers: Array.from(matchedCareers)
    });

  } catch (error) {
    res.status(500).json({ message: 'Error suggesting careers', error: error.message });
  }
};


const User = require('../models/User');
const roadmaps = require('../data/roadmaps');

exports.selectCareer = async (req, res) => {
  try {
    const { career } = req.body;
    const userId = req.user.id;

    const roadmapExists = roadmaps[career];
    if (!roadmapExists) return res.status(400).json({ message: 'Invalid career selected' });

    await User.findByIdAndUpdate(userId, { career });

    res.json({ message: 'Career selected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving career', error: error.message });
  }
};

exports.getRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.career) return res.status(404).json({ message: 'No career selected yet' });

    const roadmap = roadmaps[user.career];
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

    res.json({ career: user.career, roadmap });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roadmap', error: error.message });
  }
};

const courseList = require('../data/careerCourses');

exports.getCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.career) return res.status(400).json({ message: 'No career selected' });

    const courses = courseList[user.career];
    if (!courses) return res.status(404).json({ message: 'No courses available for this career yet' });

    res.json({ career: user.career, courses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};



exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user info
    const user = await User.findById(userId);
    if (!user?.career) {
      return res.status(400).json({ message: 'No career selected' });
    }

    const roadmap = roadmaps[user.career];
    if (!roadmap) {
      return res.status(404).json({ message: 'No roadmap found for this career' });
    }

    // Resume skills
    const resumeSkills = user.resumeKeywords || [];

    // Assessment skills
    const assessment = await Assessment.findOne({ user: userId }).sort({ createdAt: -1 });
    const assessmentSkills = assessment ? assessment.answers.map(a => a.toLowerCase()) : [];

    const acquiredSkills = [...new Set([...resumeSkills, ...assessmentSkills.map(a => a.toLowerCase())])];
    const requiredSkills = roadmap.skills.map(skill => skill.toLowerCase());

    const completed = requiredSkills.filter(skill => acquiredSkills.includes(skill));
    const remaining = requiredSkills.filter(skill => !acquiredSkills.includes(skill));
    const progress = Math.floor((completed.length / requiredSkills.length) * 100);

    res.json({
      career: user.career,
      totalSkills: requiredSkills.length,
      completed,
      remaining,
      progressPercent: progress
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch progress', error: error.message });
  }

  exports.updateRoadmap = async (req, res) => {
  const { career, updatedSteps } = req.body;

  if (!career || !Array.isArray(updatedSteps)) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  // Simulate a dynamic roadmap update (store in memory for now)
  const roadmapStore = require('../data/roadmaps');
  roadmapStore[career] = updatedSteps;

  res.json({ message: `Roadmap for ${career} updated`, roadmap: updatedSteps });
};
const roadmaps = require('../data/roadmaps');

exports.updateRoadmap = async (req, res) => {
  const { career, newSteps } = req.body;

  if (!career || !Array.isArray(newSteps)) {
    return res.status(400).json({ message: 'Invalid request format' });
  }

  if (!roadmaps[career]) {
    return res.status(404).json({ message: 'Career not found in roadmaps' });
  }

  roadmaps[career] = newSteps;
  res.json({ message: 'Roadmap updated', updatedRoadmap: newSteps });
};


};
