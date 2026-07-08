// FILE: middleware/authenticate.js
// Protects routes that require a logged-in user.
//
// Usage:
//   const authenticate = require("../middleware/authenticate");
//   router.get("/protected", authenticate, controller);
//
// On success, attaches `req.user = { id, email }` for downstream handlers.

const { verifyToken } = require("../lib/jwt");

function authenticate(req, res, next) {
  // 1. Extract the token from the Authorization header
  //    Expected format: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  const token = authHeader.split(" ")[1];

  // 2. Verify the token's signature and expiry
  try {
    const decoded = verifyToken(token);
    // Attach only the safe subset of the payload to the request
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
}

module.exports = authenticate;