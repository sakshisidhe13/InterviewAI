// FILE: controllers/resumeAiController.js
// PURPOSE: Upload resume → extract text → Gemini AI scores it,
//          generates interview questions, and gives word-level improvements

const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse  = require("pdf-parse");
const fs        = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function analyzeResume(req, res, next) {
  try {
    // ── 1. Make sure a file was uploaded ──────────────────────────
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF resume." });
    }

    // ── 2. Extract raw text from the PDF ─────────────────────────
    let resumeText = "";
    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      const parsed     = await pdfParse(fileBuffer);
      resumeText       = parsed.text.trim();
    } 
    catch (parseErr) {
  console.error("========== PDF PARSE ERROR ==========");
  console.error(parseErr);
  console.error(parseErr.stack);

  fs.unlink(req.file.path, () => {});

  return res.status(500).json({
    success: false,
    error: parseErr.message,
    stack: parseErr.stack,
  });
}
    // Clean up the uploaded file — we don't need to store it
    fs.unlink(req.file.path, () => {});

    if (!resumeText || resumeText.length < 100) {
      return res.status(422).json({
        message: "Your PDF appears to be empty or too short to analyze.",
      });
    }

    // ── 3. Send to Gemini AI ──────────────────────────────────────
    const prompt = `You are an expert resume reviewer, career coach, and technical recruiter with 15+ years of experience.

A candidate has uploaded their resume. Analyze it thoroughly and respond in the following EXACT JSON format — no extra text, no markdown, just raw JSON:

{
  "score": <number from 0 to 100>,
  "scoreBreakdown": {
    "formatting": <0-20>,
    "content": <0-25>,
    "skills": <0-20>,
    "experience": <0-20>,
    "impact": <0-15>
  },
  "summary": "<2-3 sentence overall assessment>",
  "strengths": [
    "<specific strength 1>",
    "<specific strength 2>",
    "<specific strength 3>"
  ],
  "improvements": [
    {
      "section": "<which section of the resume>",
      "issue": "<what the problem is>",
      "fix": "<exactly what to write or change>"
    },
    {
      "section": "<section>",
      "issue": "<issue>",
      "fix": "<fix>"
    },
    {
      "section": "<section>",
      "issue": "<issue>",
      "fix": "<fix>"
    },
    {
      "section": "<section>",
      "issue": "<issue>",
      "fix": "<fix>"
    },
    {
      "section": "<section>",
      "issue": "<issue>",
      "fix": "<fix>"
    }
  ],
  "wordsToRemove": [
    "<weak word or phrase found in the resume>",
    "<another weak word or phrase>",
    "<another>"
  ],
  "wordsToAdd": [
    "<strong action verb or keyword to add>",
    "<another keyword>",
    "<another>"
  ],
  "interviewQuestions": [
    "<realistic interview question based on their background>",
    "<question 2>",
    "<question 3>",
    "<question 4>",
    "<question 5>"
  ],
  "atsScore": <number 0-100 representing how well this resume would pass automated ATS filters>,
  "atsTips": [
    "<specific ATS tip 1>",
    "<specific ATS tip 2>"
  ]
}

Here is the resume to analyze:

---
${resumeText}
---

Respond with ONLY the JSON object. No preamble, no explanation, no markdown code blocks.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // ── 4. Parse Gemini's JSON response ──────────────────────────
    let analysis;
    try {
      const raw = responseText.trim();
      // Strip any accidental markdown fences just in case
      const clean = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
      analysis = JSON.parse(clean);
    } catch (parseErr) {
      return res.status(500).json({
        message: "AI returned an unexpected response. Please try again.",
      });
    }

    return res.status(200).json({ analysis });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeResume };