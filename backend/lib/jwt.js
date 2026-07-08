// FILE: lib/jwt.js
// Centralises JWT sign and verify so the secret and options
// are never scattered across the codebase.

const jwt = require("jsonwebtoken");

const SECRET      = process.env.JWT_SECRET;
const EXPIRES_IN  = process.env.JWT_EXPIRES_IN || "7d";

if (!SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables.");
}

/**
 * Sign a JWT for the given user.
 * @param {{ id: string, email: string }} payload
 * @returns {string} signed token
 */
function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * Verify a JWT and return its decoded payload.
 * Throws JsonWebTokenError / TokenExpiredError on failure.
 * @param {string} token
 * @returns {object} decoded payload
 */
function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken };