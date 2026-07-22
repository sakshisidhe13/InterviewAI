import "../../styles/interview/progressBar.css";

export default function ProgressBar({
  current,
  total,
}) {
  const percentage = (current / total) * 100;

  return (
    <div className="progress-wrapper">

      <div className="progress-track">

        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}