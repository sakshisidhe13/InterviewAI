import "../../styles/interview/chatHeader.css";

export default function ChatHeader({
  company,
  role,
  currentQuestion,
  totalQuestions,
}) {
  return (
    <div className="chat-header">

      <div>
        <h2>🎤 Mock Interview</h2>

        <p>
          {role} • {company}
        </p>
      </div>

      <div className="question-counter">
        Question {currentQuestion} / {totalQuestions}
      </div>

    </div>
  );
}