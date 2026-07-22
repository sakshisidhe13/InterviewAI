export default function SectionCard({ title, subtitle, children, className = "" }) {
  return (
    <section
      className={`flex h-full flex-col rounded-2xl border border-slate-800/60 bg-slate-900/30 p-7 lg:p-8 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4 flex-shrink-0">
          {title && (
            <h2 className="text-xl font-semibold text-white tracking-tight">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          )}
        </div>
      )}

      <div className="flex-1">
        {children}
      </div>
    </section>
  );
}