const geminiService = require("../ai/geminiService");
const parserService = require("../ai/geminiParser");
const {
  buildInterviewStartPrompt,
  buildNextQuestionPrompt,
} = require("./interviewPromptService");

async function generateFirstQuestion({
  resumeText,
  role,
  company,
  difficulty,
}) {
  try {
    const prompt = buildInterviewStartPrompt({
      resumeText,
      role,
      company,
      difficulty,
    });

    const response = await geminiService.generate(prompt);

    return parserService.parseGeminiJSON(response);
  } catch (err) {
    console.error("Gemini unavailable.", err.message);
    const error = new Error("The AI is currently not available.");
    error.code = "AI_UNAVAILABLE";
    error.status = 503;
    throw error;
  }
}

async function generateNextQuestion({
  transcript,
  role,
  company,
  difficulty,
  questionNumber,
  totalQuestions,
}) {
  try {
    const prompt = buildNextQuestionPrompt({
      transcript,
      role,
      company,
      difficulty,
      questionNumber,
      totalQuestions,
    });

    const response = await geminiService.generate(prompt);

    return parserService.parseGeminiJSON(response);
  } catch (err) {
    console.error("Gemini unavailable.", err.message);
    const error = new Error("The AI is currently not available.");
    error.code = "AI_UNAVAILABLE";
    error.status = 503;
    throw error;
  }
}

module.exports = {
  generateFirstQuestion,
  generateNextQuestion,
};
