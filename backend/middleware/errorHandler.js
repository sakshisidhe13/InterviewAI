// FILE: middleware/errorHandler.js
// Global Express error-handling middleware.
// Must be registered LAST in server.js (after all routes).
// Any route can call next(err) or throw inside an async handler
// wrapped with a try/catch to land here.

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || err.status || 500;
  const message    = err.message    || "Internal server error.";

  // Log the full error in non-production environments for easier debugging
  if (process.env.NODE_ENV !== "production") {
    console.error(`[${req.method} ${req.path}]`, err);
  }

  res.status(statusCode).json({
    message,
    // Only expose the stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;