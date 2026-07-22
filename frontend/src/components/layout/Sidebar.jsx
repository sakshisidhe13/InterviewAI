import { NavLink, useNavigate } from "react-router-dom";
import { clearSession } from "../../lib/api";

export default function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    clearSession();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        ⚡ <span>InterviewAI</span>
      </div>

      <nav className="sidebar-nav">

        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/resume-upload">
          AI Resume Analyzer
        </NavLink>

        <NavLink to="/mock-interview">
          Mock Interview
        </NavLink>

      </nav>

      <button
        className="logout-btn"
        onClick={logout}
      >
        Log Out
      </button>
    </aside>
  );
}