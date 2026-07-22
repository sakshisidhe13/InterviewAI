// FILE: src/pages/Dashboard.jsx
// PURPOSE: Full AI Interview Platform dashboard UI — now using real backend data
// Save at: src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";
import { api, clearSession, getSavedUser } from "../lib/api";
import SectionHeader from "../components/layout/SectionHeader";




function Dashboard() {
  const navigate = useNavigate();
  const user = getSavedUser();

  const [resumes, setResumes] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const resumeData = await api.getResumes();
        setResumes(resumeData.resumes || []);
        const interviewData = await api.getInterviews();
        setInterviews(interviewData.interviews || []);
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

  async function handleDeleteResume(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );

    if (!confirmed) return;

    try {
      await api.deleteResume(id);

      setResumes((prev) => prev.filter((resume) => resume.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteInterview(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?",
    );

    if (!confirmed) return;

    try {
      await api.deleteInterview(id);

      setInterviews((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  const totalResumes = resumes.length;

  const averageResumeScore = totalResumes
    ? Math.round(resumes.reduce((sum, r) => sum + r.score, 0) / totalResumes)
    : 0;

  const highestResumeScore = totalResumes
    ? Math.max(...resumes.map((r) => r.score))
    : 0;

  const averageATS = totalResumes
    ? Math.round(resumes.reduce((sum, r) => sum + r.atsScore, 0) / totalResumes)
    : 0;

  // Interview statistics
  const totalInterviews = interviews.length;
  const averageInterviewScore = totalInterviews
    ? Math.round(
        interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) /
          totalInterviews,
      )
    : 0;
  const highestInterviewScore = totalInterviews
    ? Math.max(...interviews.map((i) => i.overallScore || 0))
    : 0;
  const strongHireCount = interviews.filter(
    (i) => i.recommendation === "Strong Hire",
  ).length;

  const statCards = [
    {
      id: 1,
      icon: "📄",
      label: "Total Resumes",
      value: String(totalResumes),
      delta: "",
      positive: null,
    },
    {
      id: 2,
      icon: "📊",
      label: "Average Resume Score",
      value: totalResumes ? `${averageResumeScore}%` : "—",
      delta: "",
      positive: null,
    },
    {
      id: 3,
      icon: "🎯",
      label: "Highest Resume Score",
      value: totalResumes ? `${highestResumeScore}%` : "—",
      delta: "",
      positive: null,
    },
    {
      id: 4,
      icon: "🔥",
      label: "Average ATS Score",
      value: totalResumes ? `${averageATS}%` : "—",
      delta: "",
      positive: null,
    },
    {
      id: 5,
      icon: "🎤",
      label: "Total Interviews",
      value: String(totalInterviews),
      delta: "",
      positive: null,
    },
    {
      id: 6,
      icon: "⭐",
      label: "Average Interview Score",
      value: totalInterviews ? `${averageInterviewScore}%` : "—",
      delta: "",
      positive: null,
    },
    {
      id: 7,
      icon: "🏆",
      label: "Best Interview Score",
      value: totalInterviews ? `${highestInterviewScore}%` : "—",
      delta: "",
      positive: null,
    },
    {
      id: 8,
      icon: "💼",
      label: "Strong Hire Count",
      value: String(strongHireCount),
      delta: "",
      positive: null,
    },
  ];

  const resumeStatCards = statCards.slice(0, 4);
  const interviewStatCards = statCards.slice(4, 8);

  const recentResumes = resumes.slice(0, 5);

  const hasResumes = recentResumes.length > 0;

  const recentInterviews = interviews.slice(0, 5);
  const hasInterviews = recentInterviews.length > 0;

  return (
    <div className="db-shell">
        <main className="db-main">
          {loading && <p>Loading your data...</p>}
          {error && <p style={{ color: "#e5484d" }}>{error}</p>}

          {!loading && !error && (
            <>
              <SectionHeader
                eyebrow="Resume Analytics"
                description="Track your resume analysis performance and ATS optimization over time."
                className="pb-2"
              />
              <section className="db-cards-grid">
                {resumeStatCards.map((card) => (
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
                  <SectionHeader
                    eyebrow="Resume History"
                    className="pb-2"
                  />

                  <div className="db-table-wrap">
                    {!hasResumes ? (
                      <div className="db-empty-state">
                        <div className="db-empty-icon">📄</div>

                        <h3>No resume analyses yet</h3>

                        <p>
                          Upload your first resume and receive an AI-powered
                          review.
                        </p>

                        <Link className="db-primary-btn" to="/resume-upload">
                          Analyze Resume
                        </Link>
                      </div>
                    ) : (
                      <table className="db-table">
                        <thead>
                          <tr>
                            <th>Resume</th>
                            <th>Resume Score</th>
                            <th>ATS Score</th>
                            <th>Date</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentResumes.map((resume) => (
                            <tr key={resume.id}>
                              {/* Resume filename (clickable) */}
                              <td>
                                <Link
                                  to={`/resume-review/${resume.id}`}
                                  className="db-resume-link"
                                >
                                  {resume.originalName}
                                </Link>
                              </td>

                              {/* Resume Score */}
                              <td>
                                <div className="db-score-cell">
                                  <span className="db-score-num">
                                    {resume.score}%
                                  </span>

                                  <div className="db-score-bar-track">
                                    <div
                                      className="db-score-bar-fill"
                                      style={{ width: `${resume.score}%` }}
                                    />
                                  </div>
                                </div>
                              </td>

                              {/* ATS Score */}
                              <td>
                                <div className="db-score-cell">
                                  <span className="db-score-num">
                                    {resume.atsScore}%
                                  </span>

                                  <div className="db-score-bar-track">
                                    <div
                                      className="db-score-bar-fill"
                                      style={{ width: `${resume.atsScore}%` }}
                                    />
                                  </div>
                                </div>
                              </td>

                              {/* Upload Date */}
                              <td className="db-date-cell">
                                {new Date(resume.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </td>

                              {/* Delete */}
                              <td>
                                <button
                                  className="db-delete-btn"
                                  onClick={() => handleDeleteResume(resume.id)}
                                >
                                  🗑
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </section>

                <section>
                  <SectionHeader
                    eyebrow="Interview Analytics"
                    description="Review your interview performance across all completed mock interviews."
                    className="pb-2"
                  />
                  <div className="db-cards-grid">
                    {interviewStatCards.map((card) => (
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
                  </div>
                </section>

                <section className="db-table-section">
                  <SectionHeader
                    eyebrow="Interview History"
                    className="pb-2"
                  />

                  <div className="db-table-wrap">
                    {!hasInterviews ? (
                      <div className="db-empty-state">
                        <div className="db-empty-icon">🎤</div>

                        <h3>No interviews yet</h3>

                        <p>
                          Start your first AI interview to receive a detailed performance analysis.
                        </p>

                        <Link className="db-primary-btn" to="/interview">
                          Start Interview
                        </Link>
                      </div>
                    ) : (
                      <table className="db-table">
                        <thead>
                          <tr>
                            <th>Interview</th>
                            <th>Company</th>
                            <th>Role</th>
                            <th>Score</th>
                            <th>Date</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentInterviews.map((interview) => (
                            <tr key={interview.id}>
                              <td>
                                <Link
                                  to={`/interviews/${interview.id}`}
                                  className="db-resume-link"
                                >
                                  {interview.title || interview.company || interview.role || "Interview"}
                                </Link>
                              </td>
                              <td>{interview.company || "—"}</td>
                              <td>{interview.role || "—"}</td>
                              <td>
                                <div className="db-score-cell">
                                  <span className="db-score-num">
                                    {interview.overallScore}%
                                  </span>

                                  <div className="db-score-bar-track">
                                    <div
                                      className="db-score-bar-fill"
                                      style={{ width: `${interview.overallScore}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="db-date-cell">
                                {new Date(interview.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </td>
                              <td>
                                <button
                                  className="db-delete-btn"
                                  onClick={() => handleDeleteInterview(interview.id)}
                                >
                                  🗑
                                </button>
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
  );
}

export default Dashboard;
