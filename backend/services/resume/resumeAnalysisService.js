// services/resume/resumeAnalysisService.js
const pdfParse = require("pdf-parse");
const prisma = require("../../lib/prisma");

const {buildResumeAnalysisPrompt,} = require("../ai/promptService");
const { parseGeminiJSON } = require("../ai/geminiParser");
const { generate } = require("../ai/geminiService");

async function analyzeResume(file, userId) {
     let resumeText = "";
    try {
      const parsed = await pdfParse(file.buffer);
      resumeText = parsed.text.trim();
    } 
    catch (parseErr) {
        console.error("========== PDF PARSE ERROR ==========");
        console.error(parseErr);

    throw new Error("Unable to parse the uploaded PDF.");
}

    if (!resumeText || resumeText.length < 100) {
      throw new Error(
        "Your PDF appears to be empty or too short to analyze."
     );
    }

    const prompt =buildResumeAnalysisPrompt(resumeText);
    const responseText = await generate(prompt);

    const analysis = parseGeminiJSON(responseText);
    const savedResume = await prisma.resume.create({
      data: {
        userId,
        originalName: file.originalname,
        resumeText,
        score: analysis.score,
        atsScore: analysis.atsScore,
        feedback: analysis.summary,
        analysis,
      },
    });
    return {
      resume: {
        id: savedResume.id,
      },
      analysis,
    };

}

module.exports = {
    analyzeResume,
};