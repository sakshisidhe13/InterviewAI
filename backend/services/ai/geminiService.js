const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generate(prompt) {
  const MAX_RETRIES = 5;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      const message = err?.message || "";

      const retryable =
        message.includes("503") ||
        message.includes("Service Unavailable") ||
        message.includes("high demand") ||
        message.includes("429");

      if (!retryable || attempt === MAX_RETRIES) {
        throw err;
      }

      const delay = Math.pow(2, attempt) * 1000;

      console.log(
        `Gemini unavailable (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${delay / 1000}s...`
      );

      await sleep(delay);
    }
  }
}

module.exports = {
  generate,
};