// FILE: src/components/ProtectedRoute.jsx
// Wraps a page so it's only shown if the user is logged in.
// If not logged in, redirects to /login.

import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../lib/api";

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;