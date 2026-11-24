require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

app.get('/api/health', (_req, res) => res.json({ ok: true, configured: Boolean(ai), model }));

app.post('/api/generate', async (req, res) => {
  const { type, topic, audience, tone, platform, length } = req.body || {};
  if (!ai) return res.status(503).json({ error: 'Gemini API key is not configured. Add it to your .env file.' });
  if (!topic || typeof topic !== 'string' || topic.trim().length < 3) return res.status(400).json({ error: 'Please enter a topic or brief (at least 3 characters).' });
  const validTypes = ['social', 'blog', 'email', 'ad', 'caption', 'ideas'];
  if (!validTypes.includes(type)) return res.status(400).json({ error: 'Choose a valid content type.' });
  const safe = (v, fallback, max = 300) => typeof v === 'string' ? v.trim().slice(0, max) : fallback;
  const prompt = `You are an expert content creator. Generate original, polished content based on the user's brief.\nContent type: ${type}\nTopic/brief: ${safe(topic, '', 2000)}\nTarget audience: ${safe(audience, 'General audience')}\nTone: ${safe(tone, 'Professional')}\nPlatform: ${safe(platform, 'Not specified')}\nLength: ${safe(length, 'Medium')}\nFollow the format appropriate for the content type. Avoid prefacing the output with unnecessary explanations. Make the result useful, specific, and ready to edit or publish.`;
  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    res.json({ content: response.text || 'No text was returned. Please try again.' });
  } catch (err) {
    console.error('Gemini generation error:', err.message);
    res.status(502).json({ error: 'Content generation failed. Check your API key, quota, and connection, then try again.' });
  }
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`ContentForge AI running at http://localhost:${port}`));
