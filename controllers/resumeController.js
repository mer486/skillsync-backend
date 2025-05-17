const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const User = require('../models/User');
const { analyzeResumeText } = require('../services/huggingfaceService');
const NotificationService = require('../observers/NotificationService');
const EmailNotifier = require('../observers/EmailNotifier');

// Utility to extract structured keywords from Hugging Face response
const extractKeywords = (entities = []) => {
  const skills = [];
  const organizations = [];
  const jobTitles = [];

  for (const item of entities) {
    const type = item.entity_group?.toUpperCase();
    if (type === 'ORG') {
      organizations.push(item.word);
    } else if (type === 'JOB' || type === 'TITLE') {
      jobTitles.push(item.word);
    } else if (type === 'MISC' || type === 'SKILL') {
      skills.push(item.word);
    }
  }

  return { skills, organizations, jobTitles };
};

// POST /api/resume/upload
exports.uploadAndAnalyze = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    let text = '';
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const parsed = await pdfParse(dataBuffer);
      text = parsed.text;
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: file.path });
      text = result.value;
    } else {
      return res.status(400).json({ message: 'Unsupported file format' });
    }

    const { entities, suggestions } = await analyzeResumeText(text);
    const { skills, organizations, jobTitles } = extractKeywords(entities);

    const updateData = {
      resumeKeywords: skills,
      lastResumeAnalysis: {
        skills,
        organizations,
        jobTitles,
        suggestions,
      },
    };

    await User.findByIdAndUpdate(req.user.id, updateData);

    const notifier = new NotificationService();
    notifier.attach(new EmailNotifier());
    notifier.notify(`Resume uploaded by ${req.user.email} was analyzed.`);

    res.json({
      message: 'Resume analyzed successfully',
      extracted: { skills, organizations, jobTitles },
      suggestions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Resume analysis failed', error: error.message });
  }
};

// GET /api/resume/analysis
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
