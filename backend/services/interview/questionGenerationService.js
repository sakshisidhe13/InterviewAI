
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
    console.error("Gemini unavailable. Using fallback question.", err.message);

    return {
      question: `Tell me about yourself and why you're interested in the ${role} position at ${company}.`,
      topic: "Introduction",
      difficulty,
      questionType: "Behavioral",
    };
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
    console.error("Gemini unavailable. Using fallback question.", err.message);

    const fallbackQuestions = [
      {
        question: "Can you explain the Virtual DOM and how React uses it?",
        topic: "React",
        difficulty: "Medium",
        questionType: "Technical",
      },
      {
        question: "What is the difference between useState and useReducer?",
        topic: "React",
        difficulty: "Medium",
        questionType: "Technical",
      },
      {
        question: "Explain JavaScript closures with a practical example.",
        topic: "JavaScript",
        difficulty: "Medium",
        questionType: "Technical",
      },
      {
        question: "Describe a challenging bug you faced and how you solved it.",
        topic: "Problem Solving",
        difficulty: "Medium",
        questionType: "Behavioral",
      },
      {
        question: "How would you optimize the performance of a React application?",
        topic: "Performance",
        difficulty: "Hard",
        questionType: "Technical",
      },
    ];

    return (
      fallbackQuestions[(questionNumber - 1) % fallbackQuestions.length]
    );
  }
}

module.exports = {
  generateFirstQuestion,
  generateNextQuestion,
};