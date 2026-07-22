// =============================================
// FILE: src/components/Navbar.jsx
// PURPOSE: Top navigation bar — uses React Router's Link for navigation
// CHANGE FROM BEFORE: Replaced <a href="..."> with <Link to="...">
//   Why? <a> tags do a full page reload. <Link> navigates without reloading,
//   which is the whole point of a single-page app (SPA).
// =============================================

// Import Link from react-router-dom — it renders as an <a> tag but
// intercepts the click and updates the URL without a page reload.
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      {/* Logo — clicking it goes back to the Home page */}
      <div className="navbar-logo">
        <Link to="/">InterviewAI</Link>
      </div>

      {/* Center navigation links */}
      <ul className="navbar-links">
        {/* Link to="/path" is the router equivalent of href="/path" */}
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Signup</Link></li>
      </ul>

      {/* Login button on the right — also uses Link so it navigates via router */}
      <div className="navbar-actions">
        <Link to="/login">
          <button className="btn-login">Login</button>
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;
