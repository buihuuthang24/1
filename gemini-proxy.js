    // Gemini Proxy Server (Node.js)
// Đặt file này cùng thư mục với chatbot.js
// Cài đặt: npm install express axios cors

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyBOIz1Yt5IDODA_U8sB1TvB5IusHnLxXZo";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

app.post('/gemini', async (req, res) => {
  try {
    // Accept both 'text' and 'prompt' for compatibility
    const userText = req.body.text || req.body.prompt;
    if (!userText) {
      console.error('Missing text in request body:', req.body);
      return res.status(400).json({ error: 'Missing text or prompt in request body' });
    }
    const payload = {
      contents: [{ parts: [{ text: userText }] }]
    };
    const response = await axios.post(GEMINI_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Gemini proxy error:', err.message, err.response?.data || '');
    res.status(500).json({ error: 'Gemini proxy server error', details: err.message, response: err.response?.data || null });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Gemini proxy server running at http://localhost:${PORT}/gemini`);
});
