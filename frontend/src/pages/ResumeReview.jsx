// FILE: src/pages/ResumeReview.jsx
// PURPOSE: Temporary placeholder for the upcoming Resume Analysis page.

import { Link } from "react-router-dom";
import SectionHeader from "../components/layout/SectionHeader";
import "./Dashboard.css";

function ResumeReview() {
  return (
    <div className="db-shell">
      <div className="db-right" style={{ gridColumn: "1 / -1" }}>
        <main className="db-main">
          <section style={{ maxWidth: 900, margin: "0 auto" }}>
            <SectionHeader
              eyebrow="Resume Analysis"
              description="This page is being redesigned to match the Interview Analysis experience."
            />

            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-10 text-center">
              <h2 className="text-2xl font-semibold text-white">
                Resume Analysis Redesign in Progress
              </h2>

              <p className="mt-4 text-slate-300 leading-7">
                The legacy manual review form has been retired. This page will soon
                display a complete AI-powered resume report using the same reusable
                components as the Interview Analysis page.
              </p>

              <Link to="/dashboard" className="btn-primary inline-block mt-8">
                Back to Dashboard
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default ResumeReview;