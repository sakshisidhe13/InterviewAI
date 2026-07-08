// FILE: routes/resumeAiRoutes.js
// PURPOSE: Resume upload + AI analysis endpoint

const express  = require("express");
const multer   = require("multer");
const path     = require("path");
const router   = express.Router();

const authenticate    = require("../middleware/authenticate");
const { analyzeResume } = require("../controllers/resumeAiController");

// Store uploaded file temporarily in the uploads/ folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename:    (req, file, cb) => {
    const unique = `resume_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

// Only accept PDFs
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted."));
    }
  },
});

// POST /api/ai/analyze-resume
// Protected + accepts a single file field named "resume"
router.post(
  "/analyze-resume",
  authenticate,
  upload.single("resume"),
  analyzeResume
);

module.exports = router;