const Assessment = require('../models/Assessment');  // Ensure this import is added

// Function to submit an assessment
exports.submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user.id;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Answers are required' });
    }

    // New structured scoring logic
    const totalScore = answers.reduce((sum, item) => sum + item.score, 0);

    const assessment = new Assessment({
      user: userId,
      answers,
      totalScore
    });

    await assessment.save();

    res.status(201).json({
      message: 'Assessment submitted successfully',
      totalScore,
      assessment
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit assessment', error: error.message });
  }
};

// Function to get the assessment history
exports.getAssessmentHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the request

    // Fetch assessments for the current user
    const assessments = await Assessment.find({ user: userId });

    if (!assessments || assessments.length === 0) {
      return res.status(404).json({ message: 'No assessments found for this user' });
    }

    // Return the assessment history
    res.status(200).json({
      message: 'Assessment history retrieved successfully',
      assessments
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve assessment history', error: error.message });
  }
};

// controllers/assessmentController.js

const careerMapping = require('../data/roadmaps');

exports.suggestCareers = async (req, res) => {
  const userId = req.user.id;

  // 1. Fetch last submitted assessment
  const lastAssessment = await Assessment.findOne({ user: userId }).sort({ createdAt: -1 });

  if (!lastAssessment) {
    return res.status(404).json({ message: 'No assessments found to suggest careers' });
  }

  const answers = lastAssessment.answers;

  // 2. Basic mapping (you can expand later)
  let careerScores = {
    "frontend developer": 0,
    "backend developer": 0,
    "data analyst": 0,
    "ai/ml engineer": 0,
    "mobile app developer": 0,
    "ui/ux designer": 0,
  };

  for (const answer of answers) {
    const q = answer.question.toLowerCase();
    const score = answer.score;

    if (q.includes("design") || q.includes("interface")) {
      careerScores["ui/ux designer"] += score;
    } else if (q.includes("data")) {
      careerScores["data analyst"] += score;
    } else if (q.includes("algorithm") || q.includes("logic")) {
      careerScores["backend developer"] += score;
    } else if (q.includes("web") || q.includes("html")) {
      careerScores["frontend developer"] += score;
    } else if (q.includes("mobile") || q.includes("flutter")) {
      careerScores["mobile app developer"] += score;
    } else if (q.includes("ai") || q.includes("machine")) {
      careerScores["ai/ml engineer"] += score;
    }
  }

  const sorted = Object.entries(careerScores).sort((a, b) => b[1] - a[1]);
  const topCareer = sorted[0][0];

  res.json({
    suggestedCareer: topCareer,
    roadmap: careerMapping[topCareer]
  });
};
