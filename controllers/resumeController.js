// controllers/resumeController.js
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const User = require('../models/User');
const { analyzeResumeText } = require('../services/huggingfaceService');
const NotificationService = require('../observers/NotificationService');
const EmailNotifier = require('../observers/EmailNotifier');

const extractKeywords = (entities) => {
  const skills = [];
  const organizations = [];
  const jobTitles = [];

  for (const item of entities) {
    if (item.entity_group === 'SKILL') {
      skills.push(item.word);
    } else if (item.entity_group === 'ORG') {
      organizations.push(item.word);
    } else if (item.entity_group === 'JOB' || item.entity_group === 'TITLE') {
      jobTitles.push(item.word);
    }
  }

  return { skills, organizations, jobTitles };
};

exports.uploadAndAnalyze = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    // Extract text from resume
    let text = '';
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const parsed = await pdfParse(dataBuffer);
      text = parsed.text;
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: file.path });
      text = result.value;
    } else {
      return res.status(400).json({ message: 'Unsupported file format' });
    }

    // Analyze resume using Hugging Face
    const aiResult = await analyzeResumeText(text);
    const { skills, organizations, jobTitles } = extractKeywords(aiResult);

    // Save skills to user profile
    await User.findByIdAndUpdate(req.user.id, { resumeKeywords: skills });

    // Observer Pattern - Notify (mock)
    const notifier = new NotificationService();
    notifier.attach(new EmailNotifier());
    notifier.notify(`Resume uploaded by ${req.user.email} was analyzed and skills saved.`);

    res.json({
      message: 'Resume analyzed successfully',
      extracted: { skills, organizations, jobTitles },
    });
  } catch (error) {
    res.status(500).json({ message: 'Resume analysis failed', error: error.message });
  }
};
