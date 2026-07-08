// FILE: src/pages/Dashboard.jsx
// PURPOSE: Full AI Interview Platform dashboard UI — now using real backend data
// Save at: src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";
import { api, clearSession, getSavedUser } from "../lib/api";

const sidebarItems = [
  { id: "dashboard", icon: "⊞",  label: "Dashboard",            active: true,  to: "/dashboard" },
  { id: "resume",    icon: "🤖",  label: "AI Resume Analyzer",   active: false, to: "/resume-upload" },
  { id: "mock",      icon: "🎙️", label: "Mock Interview",       active: false, to: "/mock-interview" },
];

function scoreBadgeClass(score) {
  if (score >= 85) return "badge-excellent";
  if (score >= 70) return "badge-good";
  return "badge-average";
}

function statusFromScore(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  return "Average";
}

function Dashboard() {
  const navigate = useNavigate();
  const user = getSavedUser();

  const [interviews, setInterviews] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [interviewData, resumeData] = await Promise.all([
          api.getInterviews(),
          api.getResumes(),
        ]);
        setInterviews(interviewData.interviews || []);
        setResumes(resumeData.resumes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function handleLogout() {
    clearSession();
    navigate("/login");
  }

  const totalInterviews = interviews.length;
  const avgScore = totalInterviews
    ? Math.round(interviews.reduce((sum, i) => sum + i.score, 0) / totalInterviews)
    : 0;
  const latestResumeScore = resumes.length ? resumes[0].score : null;

  const statCards = [
    { id: 1, icon: "🎯", label: "Total Interviews", value: String(totalInterviews), delta: "", positive: null },
    { id: 2, icon: "📊", label: "Average Score",    value: totalInterviews ? `${avgScore}%` : "—", delta: "", positive: null },
    { id: 3, icon: "📄", label: "Resume Score",     value: latestResumeScore !== null ? `${latestResumeScore}%` : "—", delta: "", positive: null },
    { id: 4, icon: "🔥", label: "Current Streak",   value: "—", delta: "", positive: null },
  ];

  const recentInterviews = interviews.slice(0, 5);

  return (
    <div className="db-shell">
      <aside className="db-sidebar">
        <div className="db-sidebar-logo">
          <span className="db-logo-icon">⚡</span>
          <span className="db-logo-text">InterviewAI</span>
        </div>

        <nav className="db-sidebar-nav">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className={"db-nav-item" + (item.active ? " db-nav-item--active" : "")}
            >
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{item.label}</span>
              {item.active && <span className="db-nav-dot" />}
            </Link>
          ))}
        </nav>

        <div className="db-sidebar-footer">
          <button className="db-upgrade-btn" onClick={handleLogout} style={{ width: "100%" }}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="db-right">
        <header className="db-navbar">
          <div className="db-navbar-title">
            <h1 className="db-page-title">Dashboard</h1>
            <p className="db-page-date">Welcome{user?.name ? `, ${user.name}` : ""}</p>
          </div>

          <div className="db-navbar-right">
            <div className="db-avatar">
              <span className="db-avatar-initials">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "?"}
              </span>
            </div>
          </div>
        </header>

        <main className="db-main">
          {loading && <p>Loading your data...</p>}
          {error && <p style={{ color: "#e5484d" }}>{error}</p>}

          {!loading && !error && (
            <>
              <section className="db-cards-grid">
                {statCards.map((card) => (
                  <div className="db-stat-card" key={card.id}>
                    <div className="db-stat-icon-wrap">
                      <span className="db-stat-icon">{card.icon}</span>
                    </div>
                    <div className="db-stat-body">
                      <p className="db-stat-label">{card.label}</p>
                      <p className="db-stat-value">{card.value}</p>
                    </div>
                  </div>
                ))}
              </section>

              <div className="db-bottom-row">
                <section className="db-table-section">
                  <div className="db-section-header">
                    <h2 className="db-section-title">Recent Interviews</h2>
                  </div>

                  <div className="db-table-wrap">
                    {recentInterviews.length === 0 ? (
                      <p>No interviews logged yet.</p>
                    ) : (
                      <table className="db-table">
                        <thead>
                          <tr>
                            <th>Company</th>
                            <th>Role</th>
                            <th>Score</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentInterviews.map((row) => (
                            <tr key={row.id}>
                              <td>
                                <div className="db-company-cell">
                                  <span className="db-company-dot">{row.company[0]}</span>
                                  {row.company}
                                </div>
                              </td>
                              <td className="db-role-cell">{row.role}</td>
                              <td>
                                <div className="db-score-cell">
                                  <span className="db-score-num">{row.score}%</span>
                                  <div className="db-score-bar-track">
                                    <div className="db-score-bar-fill" style={{ width: row.score + "%" }} />
                                  </div>
                                </div>
                              </td>
                              <td className="db-date-cell">
                                {new Date(row.createdAt).toLocaleDateString()}
                              </td>
                              <td>
                                <span className={"db-status-badge " + scoreBadgeClass(row.score)}>
                                  {statusFromScore(row.score)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;