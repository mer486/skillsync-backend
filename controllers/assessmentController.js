const Assessment = require('../models/Assessment');  // Ensure this import is added

exports.submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user.id;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Answers are required' });
    }

    const totalScore = answers.reduce((sum, item) => sum + (item.score || 0), 0);

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
    res.status(500).json({
      message: 'Failed to submit assessment',
      error: error.message
    });
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

  const lastAssessment = await Assessment.findOne({ user: userId }).sort({ createdAt: -1 });

  if (!lastAssessment) {
    return res.status(404).json({ message: 'No assessments found to suggest careers' });
  }

  const answers = lastAssessment.answers;
  console.log("✅ Last assessment answers:", answers); // 👈 Add this line


  let careerScores = {
    "frontend developer": 0,
    "backend developer": 0,
    "data analyst": 0,
    "ai/ml engineer": 0,
    "mobile app developer": 0,
    "ui/ux designer": 0,
  };

  for (const answer of answers) {
  const score = answer.score;
  const category = answer.category.toLowerCase();

  if (category === "uiux" || category === "design") {
    careerScores["ui/ux designer"] += score;
  } else if (category === "data") {
    careerScores["data analyst"] += score;
  } else if (category === "backend" || category === "programming") {
    careerScores["backend developer"] += score;
  } else if (category === "frontend") {
    careerScores["frontend developer"] += score;
  } else if (category === "mobile") {
    careerScores["mobile app developer"] += score;
  } else if (category === "ai") {
    careerScores["ai/ml engineer"] += score;
  }
}


  const sorted = Object.entries(careerScores)
    .filter(([career, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    return res.status(200).json({ message: 'No matching careers found', careerSuggestions: [] });
  }

  const topSuggestions = sorted.slice(0, 3); // return top 3

  const careerSuggestions = topSuggestions.map(([careerName, score]) => {
    const skills = (careerMapping[careerName]?.skills || []).map(skill => ({
      skillName: skill,
      proficiency: 0.0,
    }));

    return {
      careerName,
      score,
      skills,
    };
  });

  // ✅ This is the final version you should paste now:
  res.json({
    message: 'Career suggestions generated',
    careerSuggestions,
  });
};

