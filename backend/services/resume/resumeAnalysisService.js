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
      resumeText = resumeText.replace(/\0/g, "");
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
    const responseText = (await generate(prompt)).replace(/\0/g, "");

    const analysis = parseGeminiJSON(responseText);
    console.log({
      resumeHasNull: resumeText.includes("\0"),
      responseHasNull: responseText.includes("\0"),
      fileNameHasNull: file.originalname.includes("\0"),
    });
    const cleanAnalysis = JSON.parse(
      JSON.stringify(analysis).replace(/\\u0000/g, "")
    );
    const savedResume = await prisma.resume.create({
      data: {
        userId,
        originalName: file.originalname,
        resumeText,
        score: analysis.score,
        atsScore: analysis.atsScore,
        feedback: analysis.summary,
        analysis: cleanAnalysis,
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