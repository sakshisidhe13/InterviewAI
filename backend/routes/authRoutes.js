// FILE: routes/authRoutes.js
// Mounts all authentication endpoints under /api/auth.
// Middleware chain per route:
//   validation → controller
//   (protected routes) → authenticate → controller

const express      = require("express");
const router       = express.Router();

const { signup, login, getMe } = require("../controllers/authController");
const { validateSignup, validateLogin } = require("../middleware/validateAuth");
const authenticate = require("../middleware/authenticate");

// POST /api/auth/signup
// Public — create a new account
router.post("/signup", validateSignup, signup);

// POST /api/auth/login
// Public — authenticate and receive a JWT
router.post("/login", validateLogin, login);

// GET /api/auth/me
// Protected — returns the current user's profile
router.get("/me", authenticate, getMe);

module.exports = router;