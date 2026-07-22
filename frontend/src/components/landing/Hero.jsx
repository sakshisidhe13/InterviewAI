// =============================================
// FILE: src/components/Hero.jsx
// PURPOSE: The main "above the fold" section users see first
// =============================================

import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  return (
    // Section with an id so the navbar "Home" link can scroll here
    <section className="hero" id="home">

      {/* Left side: headline, subtitle, and CTA button */}
      <div className="hero-content">
        <h1 className="hero-heading">
          Ace Your Next<br />
          <span className="hero-heading-accent">Technical Interview</span>
        </h1>

        <p className="hero-subtitle">
          InterviewAI uses the power of artificial intelligence to help you
          practice coding problems, get your resume reviewed, and track your
          progress — all in one place. No more guessing what to study.
        </p>

        {/* Call-to-action button */}
        <button
          className="btn-primary"
          onClick={() => navigate("/signup")}
        >
          Get Started →
        </button>
      </div>

      {/* Right side: simple CSS-based illustration (no external images) */}
      <div className="hero-illustration" aria-hidden="true">
        {/* A styled card that mimics a mock interview screen */}
        <div className="mock-screen">
          <div className="mock-screen-bar">
            {/* Fake browser dots for a polished look */}
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <div className="mock-screen-body">
            <p className="mock-label">🤖 AI Interviewer</p>
            <p className="mock-question">"Explain the difference between<br />a stack and a queue."</p>
            <div className="mock-cursor">▌</div>
          </div>
        </div>
        {/* Decorative floating emoji badges */}
        <span className="badge badge-1">✅ Resume Reviewed</span>
        <span className="badge badge-2">🧠 AI Feedback</span>
      </div>

    </section>
  );
}

export default Hero;
