// controllers/resumeController.js

const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const User = require('../models/User');
const { analyzeResumeText } = require('../services/huggingfaceService');

// ✅ Upload and Analyze Resume
exports.uploadAndAnalyze = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    let text = '';
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const parsed = await pdfParse(dataBuffer);
      text = parsed.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: file.path });
      text = result.value;
    } else {
      return res.status(400).json({ message: 'Unsupported file format' });
    }

    const { skills, organizations, jobTitles, suggestions } = await analyzeResumeText(text);

    const updateData = {
      lastResumeAnalysis: {
        skills,
        organizations,
        jobTitles,
        suggestions
      }
    };

    await User.findByIdAndUpdate(req.user.id, updateData, { new: true });

    res.json({
      message: 'Resume analyzed successfully',
      extracted: updateData.lastResumeAnalysis
    });
  } catch (error) {
    res.status(500).json({ message: 'Resume analysis failed', error: error.message });
  }
};

// ✅ Get Last Analysis for Logged In User
exports.getLastAnalysis = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('lastResumeAnalysis');
    if (!user || !user.lastResumeAnalysis) {
      return res.status(404).json({ message: 'No resume analysis found' });
    }

    res.json(user.lastResumeAnalysis);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve analysis', error: error.message });
  }
};
