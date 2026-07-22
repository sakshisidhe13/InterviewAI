

import { CheckCircle2, AlertTriangle } from "lucide-react";

export default function InsightCard({
  title,
  items = [],
  type = "success",
}) {
  const isSuccess = type === "success";

  const Icon = isSuccess ? CheckCircle2 : AlertTriangle;

  const iconColor = isSuccess
    ? "text-emerald-400"
    : "text-amber-400";

  const iconBg = isSuccess
    ? "bg-emerald-500/10"
    : "bg-amber-500/10";

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800/60 bg-slate-900/30 p-7">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`rounded-2xl p-3 ${iconBg}`}>
            <Icon className={iconColor} size={24} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">
              {isSuccess ? "Key strengths identified" : "Opportunities for growth"}
            </p>
          </div>
        </div>

        <span className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-300">
          {items.length} {items.length === 1 ? "Insight" : "Insights"}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-700 py-8 text-center text-slate-500">
          No insights available.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-4 rounded-xl border border-slate-800/60 bg-slate-900/40 p-4 transition-colors duration-200 hover:border-slate-700"
            >
              <div className={`mt-0.5 rounded-full p-1.5 ${iconBg}`}>
                <Icon size={16} className={iconColor} />
              </div>
              <p className="leading-7 text-slate-300">{item}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}