// FILE: controllers/interviewController.js
// Handles creating and retrieving a user's mock interview records.

const prisma = require("../lib/prisma");

// ── CREATE INTERVIEW ─────────────────────────────────────────────
/**
 * POST /api/interviews
 * Body: { company, role, score, notes }
 * Protected — req.user is set by the authenticate middleware.
 */
async function createInterview(req, res, next) {
  try {
    const { company, role, score, notes } = req.body;

    if (!company || !role || score === undefined) {
      return res.status(400).json({ message: "company, role, and score are required." });
    }

    const interview = await prisma.interview.create({
      data: {
        userId: req.user.id,
        company,
        role,
        score: Number(score),
        notes: notes || null,
      },
    });

    return res.status(201).json({ interview });
  } catch (err) {
    next(err);
  }
}

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
    const interview = await prisma.interview.findUnique({
      where: { id: req.params.id },
    });

    if (!interview || interview.userId !== req.user.id) {
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
    const interview = await prisma.interview.findUnique({
      where: { id: req.params.id },
    });

    if (!interview || interview.userId !== req.user.id) {
      return res.status(404).json({ message: "Interview not found." });
    }

    await prisma.interview.delete({ where: { id: req.params.id } });

    return res.status(200).json({ message: "Interview deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { createInterview, getInterviews, getInterviewById, deleteInterview };