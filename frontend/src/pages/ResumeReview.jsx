// FILE: src/pages/ResumeReview.jsx
// PURPOSE: Form to log a resume score/feedback into the backend

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { api } from "../lib/api";

function ResumeReview() {
  const navigate = useNavigate();
  const [score, setScore] = useState(70);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.createResume(score, feedback);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="db-shell">
      <div className="db-right" style={{ gridColumn: "1 / -1" }}>
        <main className="db-main">
          <section className="db-table-section" style={{ maxWidth: 520, margin: "40px auto" }}>
            <h2 className="db-section-title">Log a Resume Review</h2>

            {error && <p style={{ color: "#e5484d", marginTop: 8 }}>{error}</p>}

            <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: 16 }}>
              <div className="form-group">
                <label htmlFor="score">Score (0–100)</label>
                <input
                  id="score"
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="feedback">Feedback (optional)</label>
                <textarea
                  id="feedback"
                  rows="4"
                  placeholder="Notes on formatting, content, keywords..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? "Saving..." : "Save Resume Review"}
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

export default ResumeReview;