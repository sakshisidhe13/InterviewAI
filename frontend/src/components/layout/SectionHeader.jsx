export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}) {
  const alignment =
    align === "center"
      ? "items-center text-center mx-auto"
      : "items-start text-left";

  return (
    <div className={`mb-4 flex flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <span className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-indigo-400">
          {eyebrow}
        </span>
      )}

      <h2 className="text-3xl font-bold tracking-tight text-white lg:text-[34px]">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}