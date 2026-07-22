import { CircleCheckBig, TriangleAlert, CircleHelp } from "lucide-react";

export default function RecommendationBadge({
  recommendation,
  summary,
  overallScore,
}) {
  const value = (recommendation || "PENDING").toUpperCase();

  const config = {
    "STRONG HIRE": {
      icon: CircleCheckBig,
      title: "Strong Hire",
      accent: "text-emerald-400",
      bg: "from-emerald-500/10 to-emerald-500/5",
      border: "border-emerald-500/20",
    },
    HIRE: {
      icon: CircleCheckBig,
      title: "Hire",
      accent: "text-green-400",
      bg: "from-green-500/10 to-green-500/5",
      border: "border-green-500/20",
    },
    "NO HIRE": {
      icon: TriangleAlert,
      title: "No Hire",
      accent: "text-red-400",
      bg: "from-red-500/10 to-red-500/5",
      border: "border-red-500/20",
    },
    PENDING: {
      icon: CircleHelp,
      title: "Evaluation Pending",
      accent: "text-slate-300",
      bg: "from-slate-700/20 to-slate-800/10",
      border: "border-slate-700",
    },
  };

  const current = config[value] || config.PENDING;
  const Icon = current.icon;

  return (
    <section
      className="relative h-full overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/30 p-7"
    >
      <div className="relative flex h-full flex-col">
        <div className="flex items-center gap-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${current.bg} border ${current.border} ${current.accent}`}>
            <Icon size={30} strokeWidth={2.4} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Hiring Decision
            </p>

            <h2 className={`mt-1 text-3xl font-black ${current.accent}`}>
              {current.title}
            </h2>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-slate-800/60 bg-slate-900/40 p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Overall Score
          </p>
          <h3 className={`mt-2 text-4xl font-black ${current.accent}`}>
            {overallScore ?? "--"}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            AI Evaluation Score
          </p>
        </div>

        <div className="mt-8 mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Recommendation Rationale
          </p>
        </div>

        <p className="flex-1 text-l leading-7 text-slate-300">
          {summary ||
            "This recommendation is based on the candidate's technical knowledge, communication, confidence, and overall interview performance."}
        </p>
      </div>
    </section>
  );
}