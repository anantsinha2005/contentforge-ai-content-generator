# Project 11 — ContentForge AI Content Generation App

ContentForge is an AI-powered content creation web app built with Node.js, Express, vanilla JavaScript, and Google's Gemini API. It generates social posts, blog drafts, emails, ad copy, captions, and brainstorming lists.


## Features
- Six content formats
- Audience, platform, tone, and length controls
- Gemini-powered generation through a server-side API route
- Copy and regenerate actions
- Responsive interface
- API key stored in environment variables, not frontend code
- Health endpoint at `/api/health`

## Requirements
- Node.js 18+
- Gemini API key from Google AI Studio

## Setup
1. Open this project folder in VS Code.
2. In a terminal, run:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and edit the file with your Gemini key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   PORT=4000
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open http://localhost:4000 in your browser.

## Notes
- Never commit `.env` or expose your API key.
- AI content should be reviewed for accuracy and suitability before publishing.
