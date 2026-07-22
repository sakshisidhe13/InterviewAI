import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import AnalysisHeader from "../components/analysis/AnalysisHeader";
import ReportSection from "../components/layout/ReportSection";
import SectionHeader from "../components/layout/SectionHeader";
import ScoreGrid from "../components/analysis/ScoreGrid";
import ScoreCard from "../components/analysis/ScoreCard";
import SectionCard from "../components/analysis/SectionCard";
import InsightCard from "../components/analysis/InsightCard";

export default function ResumeAnalysis() {
  const { id } = useParams();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResume() {
      try {
        setLoading(true);
        setError("");

        const data = await api.getResume(id);
        setResume(data.resume);
      } catch (err) {
        setError(err.message || "Failed to load resume.");
      } finally {
        setLoading(false);
      }
    }

    loadResume();
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
        <p className="text-slate-400">Loading resume analysis...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
        <p className="text-red-400">{error}</p>
      </main>
    );
  }

  if (!resume) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
        <p className="text-slate-400">Resume not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
      <AnalysisHeader
        title={ "Resume Analysis"}
        overallScore={resume.score ?? 0}
        badgeText="AI Resume Analysis"
        description="An AI-powered review of your resume with ATS insights, strengths, improvement areas, and interview preparation."
        company="Resume"
        role="AI Analysis"
        status="Completed"
        date={
          resume.createdAt
            ? new Date(resume.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"
        }
      />

      <ReportSection>
        <SectionHeader
          eyebrow="Resume Performance"
          description="Your resume scoring overview and ATS evaluation will appear here."
        />
        <ScoreGrid>
          <ScoreCard
            label="Resume Score"
            score={resume.score ?? 0}
          />

          <ScoreCard
            label="ATS Score"
            score={resume.atsScore ?? 0}
          />

          <ScoreCard
            label="Skills"
            score={resume.analysis?.scoreBreakdown?.skills ?? 0}
          />

          <ScoreCard
            label="Experience"
            score={resume.analysis?.scoreBreakdown?.experience ?? 0}
          />
        </ScoreGrid>
      </ReportSection>

      <ReportSection>
        <SectionHeader
          eyebrow="AI Resume Analysis"
          description="Executive summary, recommendation, strengths, and improvements will be displayed here."
        />
        <div className="mt-20 lg:mt-24">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900/40 px-8 py-10 lg:px-10 lg:py-12">
            <div className="grid gap-8 xl:grid-cols-12 auto-rows-auto">
              <div className="xl:col-span-6">
                <SectionCard className="h-full" title="Executive Summary">
                  <p className="leading-8 text-slate-300">
                    {resume.analysis?.executiveSummary || "No executive summary available."}
                  </p>
                </SectionCard>
              </div>

              <div className="xl:col-span-6">
                <SectionCard className="h-full" title="Recommendation">
                  <div className="space-y-6">
                    <div>
                      
                      <div className="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300">
                        {resume.analysis?.recommendation?.decision || "No recommendation available"}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Recommendation Rationale
                      </p>
                      <p className="leading-8 text-slate-300">
                        {resume.analysis?.recommendation?.reason || "No rationale available."}
                      </p>
                    </div>
                  </div>
                </SectionCard>
              </div>

              <div className="xl:col-span-6">
                <InsightCard
                  title="Strengths"
                  type="success"
                  items={resume.analysis?.strengths || []}
                />
              </div>

              <div className="xl:col-span-6">
                <SectionCard className="h-full" title="Areas for Improvement">
                  <div className="space-y-5">
                    {(resume.analysis?.improvements || []).map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5"
                      >
                        <h4 className="mb-4 text-lg font-semibold text-amber-300">
                          {item.section}
                        </h4>

                        <div className="space-y-4">
                          <div>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                              Improvement
                            </p>
                            <p className="leading-7 text-slate-300">{item.issue}</p>
                          </div>

                          <div>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                              Suggested Fix
                            </p>
                            <p className="leading-7 text-slate-200">{item.fix}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </div>
          </div>
        </div>
      </ReportSection>

      <ReportSection>
        <SectionHeader
          eyebrow="Keywords"
          description="Missing keywords, overused phrases, and ATS recommendations will appear here."
        />
        <div className="mt-20 lg:mt-24">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900/40 p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-2">
              <SectionCard title="Missing Keywords">
                <p className="mb-6 text-sm leading-6 text-slate-400">
                  Consider incorporating these terms naturally where they accurately reflect your experience.
                </p>

                <div className="flex flex-wrap gap-3">
                  {(resume.analysis?.keywords?.missing || []).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300"
                    >
                      + {keyword}
                    </span>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Reduce Repetition">
                <p className="mb-6 text-sm leading-6 text-slate-400">
                  Replace repetitive wording with stronger action verbs and more varied language.
                </p>

                <div className="flex flex-wrap gap-3">
                  {(resume.analysis?.keywords?.overused || []).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </SectionCard>
            </div>

            <div className="mt-10 border-t border-slate-800 pt-10">
              <SectionCard title="ATS Optimization Checklist">
                <div className="space-y-4">
                  {(resume.analysis?.atsTips || []).map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5"
                    >
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-sm font-bold text-violet-300">
                        {index + 1}
                      </div>

                      <p className="leading-7 text-slate-300">{tip}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </ReportSection>

      <ReportSection>
        <SectionHeader
          eyebrow="Interview Preparation"
          description="AI-generated interview questions based on your resume will appear here."
        />
        <div className="mt-20 lg:mt-24">
          <SectionCard>
            <div className="space-y-5">
              {(resume.analysis?.interviewQuestions || []).map((question, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6"
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Question {index + 1}
                  </p>
                  <p className="leading-7 text-slate-200">{question}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </ReportSection>
    </main>
  );
}
