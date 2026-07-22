import {
  Sparkles,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Award,
} from "lucide-react";

export default function AnalysisHeader({
  title,
  role,
  company,
  status,
  date,
  overallScore,
  badgeText = "AI Interview Report",
  description = "A complete AI-powered evaluation of your interview performance.",
}) {
  const statusColors = {
    COMPLETED:
      "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    PAUSED: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    IN_PROGRESS: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  };

  const badgeClass =
    statusColors[status] ||
    "bg-slate-700/30 text-slate-300 border-slate-700";

  return (
    <header className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-8 py-6 lg:px-10 lg:py-6">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative grid gap-6 lg:grid-cols-[1fr_240px] lg:items-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300">
            <Sparkles size={16} />
            {badgeText}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            {title}
          </h1>

          <p className="mt-3 text-lg leading-7 text-slate-400">
            {description}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {role && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-2 text-slate-300">
                <BriefcaseBusiness size={16} />
                {role}
              </div>
            )}

            {company && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-2 text-slate-300">
                <Building2 size={16} />
                {company}
              </div>
            )}

            {date && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-2 text-slate-300">
                <CalendarDays size={16} />
                {date}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur">
          <Award className="mb-3 h-7 w-7 text-amber-400" />

          <span className="text-4xl lg:text-5xl font-black text-white">
            {overallScore ?? "--"}
          </span>

          <span className="mt-1 text-sm uppercase tracking-[0.2em] text-slate-500">
            Overall Score
          </span>

          {status && (
            <div className={`mt-4 rounded-full border px-4 py-2 text-xs font-semibold ${badgeClass}`}>
              {status.replaceAll("_", " ")}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}