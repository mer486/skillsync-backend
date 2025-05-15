const axios = require('axios');

exports.analyzeResumeText = async (text) => {
  const response = await axios.post(
    'https://api-inference.huggingface.co/models/dslim/bert-base-NER',
    { inputs: text },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      },
    }
  );

  const entities = response.data;
  return {
    skills: entities.filter(e => e.entity_group === 'SKILL').map(e => e.word),
    suggestions: generateSuggestions(text), // your logic or rules
  };
};

function generateSuggestions(text) {
  const suggestions = [];
  if (!text.includes('JavaScript')) suggestions.push('Consider adding JavaScript experience.');
  if (!text.includes('projects')) suggestions.push('Include completed projects.');
  return suggestions;
}
