function parseGeminiJSON(text) {
  try {
    const clean = text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    return JSON.parse(clean);
  } catch (err) {
    throw new Error("AI returned an invalid JSON response.");
  }
}

module.exports = {
  parseGeminiJSON,
};