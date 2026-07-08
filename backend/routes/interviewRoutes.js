// FILE: routes/interviewRoutes.js
// Protected interview endpoints — every route requires a valid JWT.

const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const {
  createInterview,
  getInterviews,
  getInterviewById,
  deleteInterview,
} = require("../controllers/interviewController");

// All routes in this file are protected
router.use(authenticate);

// POST /api/interviews — log a new interview result
router.post("/", createInterview);

// GET /api/interviews — list all interviews for the logged-in user
router.get("/", getInterviews);

// GET /api/interviews/:id — get one interview
router.get("/:id", getInterviewById);

// DELETE /api/interviews/:id — remove an interview
router.delete("/:id", deleteInterview);

module.exports = router;