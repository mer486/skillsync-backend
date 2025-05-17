// services/huggingfaceService.js
const axios = require('axios');

exports.analyzeResumeText = async (text) => {
  const response = await axios.post(
    'https://api-inference.huggingface.co/models/dslim/bert-base-NER',
    { inputs: text },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
    }
  );

  const entities = Array.isArray(response.data) ? response.data : [];

  return {
    entities,
    suggestions: generateSuggestions(text),
  };
};

function generateSuggestions(text) {
  const suggestions = [];
  const lowerText = text.toLowerCase();

  if (!lowerText.includes('javascript')) suggestions.push('Consider adding JavaScript experience.');
  if (!lowerText.includes('project')) suggestions.push('Include completed projects or achievements.');
  if (!lowerText.includes('team')) suggestions.push('Mention teamwork or collaboration skills.');

  return suggestions;
}
