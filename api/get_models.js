const axios = require('axios');
require('dotenv').config();

const key = process.env.GEMINI_API_KEY;

async function getAvailableModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    console.log(
      `Fetching available models from: ${url.replace(key, 'REDACTED')}`,
    );
    const response = await axios.get(url);

    if (response.data && response.data.models) {
      console.log('Available Models:');
      response.data.models.forEach((m) => console.log(`- ${m.name}`));
    } else {
      console.log('No models found in response:', response.data);
    }
  } catch (err) {
    console.log(
      'FAILED to fetch models:',
      err.response ? err.response.data : err.message,
    );
  }
}

getAvailableModels();
