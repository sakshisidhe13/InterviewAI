// FILE: controllers/interviewController.js
// Handles creating and retrieving a user's mock interview records.

const interviewService = require("../services/interview/interviewService");

// ── GET ALL INTERVIEWS FOR CURRENT USER ──────────────────────────
/**
 * GET /api/interviews
 * Protected — returns all interviews belonging to the logged-in user.
 */
async function getInterviews(req, res, next) {
  try {
    const interviews = await prisma.interview.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ interviews });
  } catch (err) {
    next(err);
  }
}

// ── GET ONE INTERVIEW ─────────────────────────────────────────────
/**
 * GET /api/interviews/:id
 * Protected — only returns the interview if it belongs to the logged-in user.
 */
async function getInterviewById(req, res, next) {
  try {
    const interview = await interviewService.getInterview(
      req.params.id,
      req.user.id
    );

    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    return res.status(200).json({ interview });
  } catch (err) {
    next(err);
  }
}

// ── DELETE INTERVIEW ──────────────────────────────────────────────
/**
 * DELETE /api/interviews/:id
 * Protected — only deletes if it belongs to the logged-in user.
 */
async function deleteInterview(req, res, next) {
  try {
    await interviewService.deleteInterview(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({ message: "Interview deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getInterviews, getInterviewById, deleteInterview };