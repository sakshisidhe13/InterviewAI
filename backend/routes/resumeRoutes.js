// FILE: routes/resumeRoutes.js
// Protected resume endpoints — every route requires a valid JWT.

const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const {
  createResume,
  getResumes,
  getResumeById,
  deleteResume,
} = require("../controllers/resumeController");

// All routes in this file are protected
router.use(authenticate);

// POST /api/resumes — log a new resume score/feedback record
router.post("/", createResume);

// GET /api/resumes — list all resumes for the logged-in user
router.get("/", getResumes);

// GET /api/resumes/:id — get one resume record
router.get("/:id", getResumeById);

// DELETE /api/resumes/:id — remove a resume record
router.delete("/:id", deleteResume);

module.exports = router;