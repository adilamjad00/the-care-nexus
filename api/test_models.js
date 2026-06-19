const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS_TO_TRY = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-1.0-pro',
  'text-bison-001',
];

async function testAll() {
  for (const m of MODELS_TO_TRY) {
    try {
      console.log(`Testing ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent('hi');
      console.log(`SUCCESS [${m}]`);
      return m;
    } catch (err) {
      console.log(`FAILED [${m}]: ${err.message}`);
    }
  }
}

testAll().then((m) => console.log('WINNER:', m));
