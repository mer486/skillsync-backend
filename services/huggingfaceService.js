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
    const word = e.word?.replace('##', '')?.trim();

    if (e.entity_group === 'ORG' && word) {
      organizations.push(word);
    } else if (e.entity_group === 'MISC' && word) {
      skills.push(word); // Treat MISC as skill
    } else if (e.entity_group === 'PER' && word) {
      jobTitles.push(word); // Not exact, but fallback
    }
  }

  const suggestions = [];
  if (!text.toLowerCase().includes('project')) suggestions.push('Add project experience.');
  if (!text.toLowerCase().includes('leadership')) suggestions.push('Include leadership roles.');
  if (skills.length < 3) suggestions.push('Add more technical or soft skills.');

  return { skills, organizations, jobTitles, suggestions };
};
