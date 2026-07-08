// FILE: routes/userRoutes.js
// Protected user-related endpoints.
// Every route here requires a valid JWT via the authenticate middleware.

const express      = require("express");
const router       = express.Router();
const authenticate = require("../middleware/authenticate");
const prisma       = require("../lib/prisma");

// All routes in this file are protected
router.use(authenticate);

// GET /api/users/profile
// Returns the authenticated user's full profile with interview history
router.get("/profile", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id:         true,
        name:       true,
        email:      true,
        createdAt:  true,
        interviews: { orderBy: { createdAt: "desc" }, take: 10 },
        resumes:    { orderBy: { createdAt: "desc" }, take: 5  },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found." });

    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/users/profile
// Update name (email changes should go through a separate verified flow)
router.patch("/profile", async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters." });
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data:  { name: name.trim() },
      select: { id: true, name: true, email: true, updatedAt: true },
    });

    return res.status(200).json({ user: updated });
  } catch (err) {
    next(err);
  }
});

module.exports = router;