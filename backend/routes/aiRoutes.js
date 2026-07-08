// FILE: routes/aiRoutes.js
const express = require("express");
const router  = express.Router();
const authenticate = require("../middleware/authenticate");
const { interviewFeedback, resumeFeedback, generateQuestions } = require("../controllers/aiController");

router.use(authenticate);

router.post("/interview-feedback",  interviewFeedback);
router.post("/resume-feedback",     resumeFeedback);
router.post("/generate-questions",  generateQuestions);

module.exports = router;