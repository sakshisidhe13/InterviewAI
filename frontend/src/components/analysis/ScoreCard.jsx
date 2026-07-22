import {
  Trophy,
  Code2,
  MessageSquareText,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function ScoreCard({
  label,
  score,
  description,
  accent = "text-indigo-400",
}) {
  const numericScore =
    score === null || score === undefined ? null : Math.round(score);

  const status =
    numericScore === null
      ? "Unavailable"
      : numericScore >= 85
      ? "Excellent"
      : numericScore >= 70
      ? "Good"
      : numericScore >= 50
      ? "Average"
      : "Needs Improvement";

  const progress = numericScore ?? 0;

  const icons = {
    Overall: Trophy,
    Technical: Code2,
    Communication: MessageSquareText,
    Confidence: TrendingUp,
  };

  const Icon = icons[label] || Sparkles;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 px-6 pt-7 pb-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">
            {label}
          </p>
          <p className={`mt-3 text-sm font-semibold ${accent}`}>
            {status}
          </p>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 ${accent}`}>
          <Icon size={20} strokeWidth={2.2} />
        </div>
      </div>

      <div className="mt-6 flex items-end gap-2">
        <span className={`text-5xl lg:text-5xl font-black tracking-tight ${accent}`}>
          {numericScore ?? "--"}
        </span>
        <span className="mb-2 text-xl font-semibold text-slate-500">%</span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800/80">
        <div
          style={{ width: `${progress}%` }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 transition-all duration-700"
        />
      </div>

      {description && (
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}