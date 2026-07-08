// FILE: controllers/aiController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function interviewFeedback(req, res, next) {
  try {
    const { company, role, score, notes } = req.body;
    if (!company || !role || score === undefined) {
      return res.status(400).json({ message: "company, role, and score are required." });
    }

    const result = await model.generateContent(
      `You are an expert interview coach. A candidate just completed a mock interview.
Details: Company: ${company}, Role: ${role}, Score: ${score}/100, Notes: ${notes || "None"}
Give them: 1) A brief assessment (2 sentences) 2) 3 specific strengths for this role at ${company} 3) 3 areas to improve 4) One action to do in the next 24 hours. Be direct and specific. Under 300 words.`
    );

    return res.status(200).json({ feedback: result.response.text() });
  } catch (err) { next(err); }
}

async function resumeFeedback(req, res, next) {
  try {
    const { score, feedback } = req.body;
    if (score === undefined) {
      return res.status(400).json({ message: "score is required." });
    }

    const result = await model.generateContent(
      `You are an expert resume reviewer. A candidate's resume scored ${score}/100. Their notes: ${feedback || "None"}.
Give: 1) What this score means (2 sentences) 2) 3 things to fix right now 3) 2 things they're doing well 4) One tip to stand out. Be specific and actionable. Under 250 words.`
    );

    return res.status(200).json({ feedback: result.response.text() });
  } catch (err) { next(err); }
}

async function generateQuestions(req, res, next) {
  try {
    const { company, role } = req.body;
    if (!company || !role) {
      return res.status(400).json({ message: "company and role are required." });
    }

    const result = await model.generateContent(
      `Generate exactly 5 realistic interview questions for a ${role} position at ${company}. Mix: 2 technical, 1 behavioral, 1 company-specific, 1 problem-solving. Format as a numbered list (1. 2. 3. 4. 5.) with just the questions, no explanations.`
    );

    const questions = result.response.text()
      .split("\n")
      .filter((line) => /^\d+\./.test(line.trim()))
      .map((line) => line.replace(/^\d+\.\s*/, "").trim());

    return res.status(200).json({ questions });
  } catch (err) { next(err); }
}

module.exports = { interviewFeedback, resumeFeedback, generateQuestions };