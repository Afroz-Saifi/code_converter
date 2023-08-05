const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const app = express();
const port = process.env.PORT || 4545;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openaiConfig);

async function generateCompletion(input) {
  try {
    const prompt = input;
    const maxTokens = 500;
    const n = 1;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: maxTokens,
      n,
    });

    const { choices } = response.data;
    if (choices && choices.length > 0) {
      const completion = choices[0].text.trim();
      return completion;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

app.post('/convert', async (req, res) => {
  try {
    const { language, code } = req.body;
    const response = await generateCompletion(`Convert the given blow code to ${language} \n code: \n ${code}`);
    res.json({ response });
    console.log("🚀 ~ file: index.js:53 ~ app.post ~ response:", response)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// debug
app.post('/debug', async (req, res) => {
  try {
    const { code } = req.body;
    const response = await generateCompletion(`Debug the given blow code with explanation : \n ${code}`);
    res.json({ response });
    console.log("🚀 ~ file: index.js:53 ~ app.post ~ response:", response)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// quality check
app.post('/qualityCheck', async (req, res) => {
  try {
    const { code } = req.body;
    const response = await generateCompletion(`Check the quality of the given blow code, give rating out of 10 on parameters like accuracy, time complaxity, space complaxity \n ${code} \n at the end give some suggetions`);
    res.json({ response });
    console.log("🚀 ~ file: index.js:53 ~ app.post ~ response:", response)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});