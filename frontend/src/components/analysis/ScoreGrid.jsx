export default function ScoreGrid({ children, className = "" }) {
  return (
    <section
      className={`grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4 ${className}`}
    >
      {children}
    </section>
  );
}