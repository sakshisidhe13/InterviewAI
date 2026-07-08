// FILE: controllers/resumeController.js
// Handles creating and retrieving a user's resume score/feedback records.

const prisma = require("../lib/prisma");

// ── CREATE RESUME RECORD ─────────────────────────────────────────
/**
 * POST /api/resumes
 * Body: { score, feedback }
 * Protected — req.user is set by the authenticate middleware.
 */
async function createResume(req, res, next) {
  try {
    const { score, feedback } = req.body;

    if (score === undefined) {
      return res.status(400).json({ message: "score is required." });
    }

    const resume = await prisma.resume.create({
      data: {
        userId: req.user.id,
        score: Number(score),
        feedback: feedback || null,
      },
    });

    return res.status(201).json({ resume });
  } catch (err) {
    next(err);
  }
}

// ── GET ALL RESUMES FOR CURRENT USER ─────────────────────────────
/**
 * GET /api/resumes
 * Protected — returns all resume records belonging to the logged-in user.
 */
async function getResumes(req, res, next) {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ resumes });
  } catch (err) {
    next(err);
  }
}

// ── GET ONE RESUME ────────────────────────────────────────────────
/**
 * GET /api/resumes/:id
 * Protected — only returns the resume if it belongs to the logged-in user.
 */
async function getResumeById(req, res, next) {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: req.params.id },
    });

    if (!resume || resume.userId !== req.user.id) {
      return res.status(404).json({ message: "Resume not found." });
    }

    return res.status(200).json({ resume });
  } catch (err) {
    next(err);
  }
}

// ── DELETE RESUME ─────────────────────────────────────────────────
/**
 * DELETE /api/resumes/:id
 * Protected — only deletes if it belongs to the logged-in user.
 */
async function deleteResume(req, res, next) {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: req.params.id },
    });

    if (!resume || resume.userId !== req.user.id) {
      return res.status(404).json({ message: "Resume not found." });
    }

    await prisma.resume.delete({ where: { id: req.params.id } });

    return res.status(200).json({ message: "Resume deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { createResume, getResumes, getResumeById, deleteResume };