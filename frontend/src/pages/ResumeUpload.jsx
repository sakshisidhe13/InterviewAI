// FILE: src/pages/ResumeUpload.jsx
// PURPOSE: Upload resume PDF → show AI score, improvements, questions

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./ResumeUpload.css";
import { api } from "../lib/api";

export default function ResumeUpload() {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);

  const [file,      setFile]      = useState(null);
  const [dragging,  setDragging]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

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

      const resumeId = result.resume?.id || result.id;

      if (!resumeId) {
        throw new Error("Resume ID was not returned by the server.");
      }

      navigate(`/resume-review/${resumeId}`);
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

          </div>
        </main>
      </div>
    </div>
  );
}