import "../../styles/interview/interviewSetupForm.css";

export default function InterviewSetupForm({
  resumes,
  loading,
  error,
  resumeId,
  setResumeId,
  company,
  setCompany,
  role,
  setRole,
  difficulty,
  setDifficulty,
  onStartInterview,
  startingInterview,
}) {
  return (
    <div className="setup-card">
      <h1>🎤 Mock Interview</h1>
      <p>Prepare for your next interview with a simulated mock interview.</p>

      <div className="setup-form">

        <div className="form-group">
          <label>Resume</label>

          <select
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
            disabled={loading}
          >
            {loading ? (
              <option>Loading resumes...</option>
            ) : resumes.length === 0 ? (
              <option>No resumes available</option>
            ) : (
              <>
                <option value="">Select Resume</option>
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.originalName}
                  </option>
                ))}
              </>
            )}
          </select>

          {error && <small className="form-error">{error}</small>}
        </div>

        <div className="form-group">
          <label>Company</label>

          <input
            type="text"
            placeholder="e.g. Google"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Role</label>

          <input
            type="text"
            placeholder="e.g. Frontend Developer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Difficulty</label>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div className="interview-info">
          <p>📝 <strong>Questions:</strong> 8</p>
          <p>⏰ <strong>Estimated Time:</strong> 10–15 mins</p>
        </div>

        <button
          className="btn-primary"
          onClick={onStartInterview}
          disabled={startingInterview}
        >
          {startingInterview ? "Starting Interview..." : "Start Interview"}
        </button>

      </div>
    </div>
  );
}