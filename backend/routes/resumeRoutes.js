const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const {
  getResumes,
  getResumeById,
  deleteResume,
} = require("../controllers/resumeController");

router.use(authenticate);

router.get("/", getResumes);

router.get("/:id", getResumeById);

router.delete("/:id", deleteResume);

module.exports = router;