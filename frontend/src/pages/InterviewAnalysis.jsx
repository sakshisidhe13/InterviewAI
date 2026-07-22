import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import AnalysisHeader from "../components/analysis/AnalysisHeader";
import ScoreGrid from "../components/analysis/ScoreGrid";
import ScoreCard from "../components/analysis/ScoreCard";
import SectionCard from "../components/analysis/SectionCard";
import InsightCard from "../components/analysis/InsightCard";
import RecommendationBadge from "../components/analysis/RecommendationBadge";
import FeedbackAccordion from "../components/analysis/FeedbackAccordion";
import TranscriptViewer from "../components/analysis/TranscriptViewer";
import ReportSection from "../components/layout/ReportSection";
import SectionHeader from "../components/layout/SectionHeader";

export default function InterviewAnalysis() {
  const { id } = useParams();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Loading interview", id);
    async function loadInterview() {
      try {
        setLoading(true);
        setError("");

        const data = await api.getInterview(id);
        setInterview(data.interview);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load interview.");
      } finally {
        setLoading(false);
      }
    }

    loadInterview();
  }, [id]);

  if (loading) {
    return <p>Loading interview...</p>;
  }

  if (error) {
    return <p style={{ color: "#ef4444" }}>{error}</p>;
  }

  if (!interview) {
    return <p>Interview not found.</p>;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <main className="mx-auto max-w-6xl px-6 py-12 xl:px-8 xl:py-16">
        {/* ================= HERO ================= */}
        <section className="mb-28">
          <AnalysisHeader
            title="Interview Analysis"
            role={interview.role}
            company={interview.company}
            status={interview.status}
            date={
              interview.completedAt
                ? new Date(interview.completedAt).toLocaleDateString()
                : interview.createdAt
                ? new Date(interview.createdAt).toLocaleDateString()
                : null
            }
            overallScore={interview.overallScore}
          />
        </section>

        {/* ================= PERFORMANCE ================= */}
        <ReportSection>
          <SectionHeader
            className="pb-2"
            eyebrow="Performance"
            
            description="Your AI-generated interview performance across the key evaluation metrics."
          />

          <div className="mt-16 lg:mt-20">
            <ScoreGrid>
              <ScoreCard
                label="Overall"
                score={interview.overallScore}
                description="Overall interview performance"
                accent="text-emerald-400"
              />

              <ScoreCard
                label="Technical"
                score={interview.technicalScore}
                description="Technical knowledge and problem solving"
                accent="text-sky-400"
              />

              <ScoreCard
                label="Communication"
                score={interview.communicationScore}
                description="Clarity and communication skills"
                accent="text-violet-400"
              />

              <ScoreCard
                label="Confidence"
                score={interview.confidenceScore}
                description="Confidence throughout the interview"
                accent="text-amber-400"
              />
            </ScoreGrid>
          </div>
        </ReportSection>

        {/* ================= AI ANALYSIS ================= */}
        <ReportSection>
          <SectionHeader
            className="pb-2"
            eyebrow="AI PERFORMANCE ANALYSIS"
            description="A comprehensive AI evaluation of your interview performance."
          />
          <div className="mt-20 lg:mt-24">
            <div className="rounded-[32px] border border-slate-800 bg-slate-900/40 px-8 py-10 lg:px-10 lg:py-12">
              <div className="grid gap-8 xl:grid-cols-12 auto-rows-auto">
                <div className="xl:col-span-6">
                  <SectionCard
                    className="h-full"
                    title="Executive Summary"
                  >
                    <div className="max-w-3xl">
                      <p className="leading-8 text-slate-300">
                        {interview.summary || "Summary not available."}
                      </p>
                    </div>
                  </SectionCard>
                </div>

                <div className="xl:col-span-6">
                  <RecommendationBadge
                    recommendation={interview.recommendation}
                    overallScore={interview.overallScore}
                    summary={
                      interview.feedback?.recommendationReason || interview.summary
                    }
                  />
                </div>

                <div className="xl:col-span-6">
                  <InsightCard
                    title="Strengths"
                    type="success"
                    items={interview.feedback?.strengths || []}
                  />
                </div>

                <div className="xl:col-span-6">
                  <InsightCard
                    title="Areas for Improvement"
                    type="warning"
                    items={interview.feedback?.improvements || []}
                  />
                </div>
              </div>
            </div>
          </div>
        </ReportSection>

        {/* ================= DETAILED REVIEW ================= */}
        <ReportSection>
          <SectionHeader
            className="pb-2"
            eyebrow="Review"
            description="Detailed AI evaluation for each interview response."
          />

          <div className="mt-16 lg:mt-20">
            <SectionCard>
              <FeedbackAccordion
                feedback={interview.feedback?.questionFeedback || []}
              />
            </SectionCard>
          </div>
        </ReportSection>

        {/* ================= TRANSCRIPT ================= */}
        <ReportSection compact>
          <SectionHeader
            className="pb-2"
            eyebrow="Transcript"
            description="Replay the complete conversation between you and the AI interviewer."
          />

          <div className="mt-16 lg:mt-20">
            <SectionCard>
              <TranscriptViewer transcript={interview.transcript || []} />
            </SectionCard>
          </div>
        </ReportSection>
      </main>
    </div>
  );
}
