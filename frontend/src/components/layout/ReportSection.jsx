export default function ReportSection({
  children,
  className = "",
  compact = false,
}) {
  return (
    <section
      className={`w-full ${
        compact ? "py-12" : "py-20 lg:py-24"
      } ${className}`}
    >
      {children}
    </section>
  );
}