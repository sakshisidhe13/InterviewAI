// FILE: src/pages/ResumeUpload.jsx
// PURPOSE: Upload resume PDF → show AI score, improvements, questions

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./ResumeUpload.css";
import { api } from "../lib/api";

function ScoreRing({ score }) {
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const fill   = (score / 100) * circ;
  const color  = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#e5484d";

  return (
    <div className="score-ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#2a2a3d" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="score-ring-label">
        <span className="score-ring-num" style={{ color }}>{score}</span>
        <span className="score-ring-sub">/ 100</span>
      </div>
    </div>
  );
}

export default function ResumeUpload() {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);

  const [file,      setFile]      = useState(null);
  const [dragging,  setDragging]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [analysis,  setAnalysis]  = useState(null);
  const [tab,       setTab]       = useState("overview"); // overview | improvements | questions

  function pickFile(f) {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setError("");
    } else {
      setError("Please select a PDF file.");
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files[0]);
  }

  async function handleAnalyze() {
    if (!file) { setError("Please select a PDF first."); return; }
    setError("");
    setLoading(true);
    try {
      const result = await api.analyzeResume(file);
      setAnalysis(result.analysis);
      setTab("overview");
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
          <div style={{ maxWidth: 720, margin: "40px auto" }}>

            {/* ── UPLOAD AREA ── */}
            {!analysis && (
              <section className="db-table-section">
                <h2 className="db-section-title">🤖 AI Resume Analyzer</h2>
                <p style={{ color: "#aaa", marginBottom: 24, fontSize: 14 }}>
                  Upload your resume PDF and get an instant AI score, detailed improvements, interview questions, and ATS tips.
                </p>

                {/* Drop zone */}
                <div
                  className={`ru-dropzone${dragging ? " ru-dropzone--active" : ""}${file ? " ru-dropzone--filled" : ""}`}
                  onClick={() => fileRef.current.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/pdf"
                    style={{ display: "none" }}
                    onChange={(e) => pickFile(e.target.files[0])}
                  />
                  {file ? (
                    <>
                      <span style={{ fontSize: 36 }}>📄</span>
                      <p style={{ marginTop: 8, color: "#a78bfa", fontWeight: 600 }}>{file.name}</p>
                      <p style={{ color: "#aaa", fontSize: 13 }}>Click to change file</p>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: 36 }}>⬆️</span>
                      <p style={{ marginTop: 8, color: "#e2e8f0" }}>Drag & drop your resume here</p>
                      <p style={{ color: "#aaa", fontSize: 13 }}>or click to browse — PDF only, max 5MB</p>
                    </>
                  )}
                </div>

                {error && <p style={{ color: "#e5484d", marginTop: 12 }}>{error}</p>}

                <button
                  className="btn-primary btn-full"
                  style={{ marginTop: 20 }}
                  onClick={handleAnalyze}
                  disabled={loading || !file}
                >
                  {loading ? "⚡ Analyzing your resume..." : "Analyze Resume with AI"}
                </button>

                {loading && (
                  <p style={{ color: "#a78bfa", fontSize: 13, marginTop: 12, textAlign: "center" }}>
                    This takes about 10–15 seconds — Claude is reading your resume carefully.
                  </p>
                )}
              </section>
            )}

            {/* ── RESULTS ── */}
            {analysis && (
              <>
                {/* Score cards row */}
                <section className="db-table-section" style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
                    <div>
                      <h2 className="db-section-title" style={{ marginBottom: 4 }}>Resume Score</h2>
                      <ScoreRing score={analysis.score} />
                    </div>

                    <div style={{ flex: 1, minWidth: 220 }}>
                      <p style={{ color: "#e2e8f0", lineHeight: 1.7, marginBottom: 16 }}>
                        {analysis.summary}
                      </p>
                      <div className="ru-breakdown">
                        {Object.entries(analysis.scoreBreakdown).map(([key, val]) => (
                          <div key={key} className="ru-breakdown-row">
                            <span className="ru-breakdown-label">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                            <div className="ru-bar-track">
                              <div className="ru-bar-fill" style={{ width: `${(val / (key === "content" ? 25 : key === "skills" || key === "experience" ? 20 : key === "impact" ? 15 : 20)) * 100}%` }} />
                            </div>
                            <span className="ru-breakdown-val">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <p style={{ color: "#aaa", fontSize: 13, marginBottom: 4 }}>ATS Score</p>
                      <p style={{ fontSize: 36, fontWeight: 700, color: analysis.atsScore >= 70 ? "#22c55e" : "#f59e0b" }}>
                        {analysis.atsScore}%
                      </p>
                      <p style={{ color: "#aaa", fontSize: 12 }}>Applicant Tracking</p>
                    </div>
                  </div>
                </section>

                {/* Tabs */}
                <div className="ru-tabs">
                  {["overview", "improvements", "questions"].map((t) => (
                    <button
                      key={t}
                      className={`ru-tab${tab === t ? " ru-tab--active" : ""}`}
                      onClick={() => setTab(t)}
                    >
                      {t === "overview" ? "💪 Strengths & Words" : t === "improvements" ? "🔧 Improvements" : "🎙️ Interview Questions"}
                    </button>
                  ))}
                </div>

                {/* OVERVIEW TAB */}
                {tab === "overview" && (
                  <section className="db-table-section">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                      {/* Strengths */}
                      <div>
                        <h3 className="ru-sub-heading">✅ Strengths</h3>
                        <ul className="ru-list ru-list--green">
                          {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>

                      {/* ATS Tips */}
                      <div>
                        <h3 className="ru-sub-heading">🤖 ATS Tips</h3>
                        <ul className="ru-list ru-list--purple">
                          {analysis.atsTips.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                      {/* Words to Remove */}
                      <div>
                        <h3 className="ru-sub-heading">❌ Words / Phrases to Remove</h3>
                        <div className="ru-tag-list">
                          {analysis.wordsToRemove.map((w, i) => (
                            <span key={i} className="ru-tag ru-tag--red">{w}</span>
                          ))}
                        </div>
                      </div>

                      {/* Words to Add */}
                      <div>
                        <h3 className="ru-sub-heading">✅ Words / Phrases to Add</h3>
                        <div className="ru-tag-list">
                          {analysis.wordsToAdd.map((w, i) => (
                            <span key={i} className="ru-tag ru-tag--green">{w}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* IMPROVEMENTS TAB */}
                {tab === "improvements" && (
                  <section className="db-table-section">
                    <h3 className="ru-sub-heading" style={{ marginBottom: 16 }}>
                      Specific Changes to Make
                    </h3>
                    {analysis.improvements.map((item, i) => (
                      <div key={i} className="ru-improvement-card">
                        <div className="ru-improvement-section">{item.section}</div>
                        <div className="ru-improvement-issue">
                          <span className="ru-label-red">Issue:</span> {item.issue}
                        </div>
                        <div className="ru-improvement-fix">
                          <span className="ru-label-green">Fix:</span> {item.fix}
                        </div>
                      </div>
                    ))}
                  </section>
                )}

                {/* QUESTIONS TAB */}
                {tab === "questions" && (
                  <section className="db-table-section">
                    <h3 className="ru-sub-heading" style={{ marginBottom: 4 }}>
                      Interview Questions Based on Your Resume
                    </h3>
                    <p style={{ color: "#aaa", fontSize: 13, marginBottom: 20 }}>
                      These questions are generated specifically from what's on your resume. Practice answering all of them.
                    </p>
                    <ol style={{ paddingLeft: 20 }}>
                      {analysis.interviewQuestions.map((q, i) => (
                        <li key={i} className="ru-question-item">{q}</li>
                      ))}
                    </ol>
                  </section>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, background: "#2a2a3d" }}
                    onClick={() => { setAnalysis(null); setFile(null); }}
                  >
                    Analyze Another Resume
                  </button>
                  <button
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => navigate("/dashboard")}
                  >
                    Back to Dashboard
                  </button>
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}