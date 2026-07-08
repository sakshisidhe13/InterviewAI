// FILE: src/pages/MockInterview.jsx
// PURPOSE: Form to log a completed interview into the backend

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { api } from "../lib/api";

function MockInterview() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [score, setScore] = useState(70);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.createInterview(company, role, score, notes);
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
            <h2 className="db-section-title">Log a Mock Interview</h2>

            {error && <p style={{ color: "#e5484d", marginTop: 8 }}>{error}</p>}

            <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: 16 }}>
              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  type="text"
                  placeholder="e.g. Google"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <input
                  id="role"
                  type="text"
                  placeholder="e.g. SWE Intern"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </div>

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
                <label htmlFor="notes">Notes (optional)</label>
                <textarea
                  id="notes"
                  rows="4"
                  placeholder="What went well, what to improve..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? "Saving..." : "Save Interview"}
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

export default MockInterview;