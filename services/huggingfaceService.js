const axios = require('axios');

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/dslim/bert-base-NER'; // Or another model
const API_KEY = process.env.HUGGINGFACE_API_KEY;

exports.analyzeResumeText = async (text) => {
  try {
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Hugging Face API error: ' + error.message);
  }
};
