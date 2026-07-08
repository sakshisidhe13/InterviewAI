// FILE: server.js
require("dotenv").config();

const express         = require("express");
const authRoutes      = require("./routes/authRoutes");
const userRoutes      = require("./routes/userRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const resumeRoutes    = require("./routes/resumeRoutes");
const aiRoutes        = require("./routes/aiRoutes");
const resumeAiRoutes  = require("./routes/resumeAiRoutes");
const errorHandler    = require("./middleware/errorHandler");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── MIDDLEWARE ─────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// CORS
app.use((req, res, next) => {
  const allowedOrigin =
    process.env.NODE_ENV === "production"
      ? process.env.CLIENT_ORIGIN
      : "http://localhost:5173";

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ── ROUTES ─────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth",       authRoutes);
app.use("/api/users",      userRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/resumes",    resumeRoutes);
app.use("/api/ai",         aiRoutes);
app.use("/api/ai",         resumeAiRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use(errorHandler);

// ── START ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT} [${process.env.NODE_ENV || "development"}]`);
});