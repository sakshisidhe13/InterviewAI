// FILE: routes/interviewRoutes.js
// Protected interview endpoints — every route requires a valid JWT.

const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const {
  getInterviews,
  getInterviewById,
  deleteInterview,
} = require("../controllers/interviewController");
const {
  startInterview,
  sendMessage,
  finishInterview,
} = require("../controllers/interviewChatController");

// All routes in this file are protected
router.use(authenticate);

// AI Mock Interview flow
router.post("/start", startInterview);
router.post("/:id/message", sendMessage);
router.post("/:id/end", finishInterview);

// GET /api/interviews — list all interviews for the logged-in user
router.get("/", getInterviews);

// GET /api/interviews/:id — get one interview
router.get("/:id", getInterviewById);

// DELETE /api/interviews/:id — remove an interview
router.delete("/:id", deleteInterview);

module.exports = router;