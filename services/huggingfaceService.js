// services/huggingfaceService.js

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

  const skills = [];
  const organizations = [];
  const jobTitles = [];

  for (const e of entities) {
    if (e.entity_group === 'ORG') organizations.push(e.word);
    else if (e.entity_group === 'TITLE' || e.entity_group === 'JOB') jobTitles.push(e.word);
    else if (e.entity_group === 'MISC' || e.entity_group === 'SKILL') skills.push(e.word);
  }

  const suggestions = [];
  if (!text.toLowerCase().includes('project')) suggestions.push('Consider listing your projects.');
  if (!text.toLowerCase().includes('leadership')) suggestions.push('Add any leadership experience.');
  if (skills.length < 3) suggestions.push('Add more skills relevant to your target role.');

  return { skills, organizations, jobTitles, suggestions };
};
