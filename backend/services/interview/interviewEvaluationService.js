const geminiService = require("../ai/geminiService");
const buildEvaluationPrompt = require("./interviewPromptService").buildInterviewEvaluationPrompt;

async function evaluateInterview({ transcript, role, company }) {
  const prompt = buildEvaluationPrompt({
    transcript,
    role,
    company,
  });

  const response = await geminiService.generate(prompt);
  try {
    const evaluation = JSON.parse(response);

    console.log(
      "Parsed interview evaluation:\n",
      JSON.stringify(evaluation, null, 2)
    );

    return {
      overallScore: evaluation.overallScore,
      technicalScore: evaluation.technicalScore,
      communicationScore: evaluation.communicationScore,
      confidenceScore: evaluation.confidenceScore,
      summary: evaluation.summary,
      recommendation: evaluation.recommendation,
      feedback: {
        strengths: evaluation.strengths || [],
        improvements: evaluation.improvements || [],
        recommendationReason:
          evaluation.recommendationReason || "",
        questionFeedback:
          evaluation.questionFeedback || [],
      },
    };
  } catch (err) {
    console.error("Raw Gemini evaluation:\n", response);
    throw new Error("Failed to parse interview evaluation from Gemini.");
  }
}

module.exports = {
  evaluateInterview,
};
