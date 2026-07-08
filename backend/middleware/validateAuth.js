// FILE: middleware/validateAuth.js
// Lightweight input validation for auth routes.
// Keeps controllers clean by rejecting bad payloads before they reach business logic.
// Swap for express-validator or Zod if the project grows.

/**
 * Validates POST /api/auth/signup body.
 * Rules: name (non-empty), email (valid format), password (min 8 chars).
 */
function validateSignup(req, res, next) {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters.");
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("A valid email address is required.");
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed.", errors });
  }

  // Normalise email to lowercase before passing to the controller
  req.body.email = email.toLowerCase().trim();
  req.body.name  = name.trim();

  next();
}

/**
 * Validates POST /api/auth/login body.
 * Rules: email (valid format), password (non-empty).
 */
function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("A valid email address is required.");
  }

  if (!password || password.length === 0) {
    errors.push("Password is required.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed.", errors });
  }

  req.body.email = email.toLowerCase().trim();

  next();
}

module.exports = { validateSignup, validateLogin };