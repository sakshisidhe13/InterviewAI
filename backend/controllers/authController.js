// FILE: controllers/authController.js
// Handles user registration and login business logic.
// Controllers are kept thin — validation lives in middleware,
// DB access goes through Prisma, tokens through lib/jwt.js.

const bcrypt    = require("bcryptjs");
const prisma    = require("../lib/prisma");
const { signToken } = require("../lib/jwt");

// How many bcrypt salt rounds to use.
// 12 is the production-safe minimum (balances security vs latency).
const SALT_ROUNDS = 12;

// ── SIGNUP ────────────────────────────────────────────────────────
/**
 * POST /api/auth/signup
 * Body: { name, email, password }
 * Returns: { user, token }
 */
async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    // 1. Check if email is already registered
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email is already in use." });
    }

    // 2. Hash the password — never store plain text
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Persist the new user
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      // Only select the fields the client needs — never return passwordHash
      select: { id: true, name: true, email: true, createdAt: true },
    });

    // 4. Issue a JWT so the user is immediately authenticated
    const token = signToken({ id: user.id, email: user.email });

    return res.status(201).json({ user, token });
  } catch (err) {
    console.error("[signup]", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}

// ── LOGIN ─────────────────────────────────────────────────────────
/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { user, token }
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Look up the user — include passwordHash for comparison
    const user = await prisma.user.findUnique({ where: { email } });

    // Use a generic message to avoid leaking whether the email exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 2. Compare the candidate password against the stored hash
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 3. Issue a JWT
    const token = signToken({ id: user.id, email: user.email });

    // 4. Return safe user fields (strip passwordHash)
    const { passwordHash: _omit, ...safeUser } = user;

    return res.status(200).json({ user: safeUser, token });
  } catch (err) {
    console.error("[login]", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}

// ── GET CURRENT USER ──────────────────────────────────────────────
/**
 * GET /api/auth/me
 * Protected route — req.user is set by the authenticate middleware.
 * Returns the authenticated user's profile.
 */
async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("[getMe]", err);
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = { signup, login, getMe };