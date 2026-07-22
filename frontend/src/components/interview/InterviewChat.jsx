import ChatHeader from "./ChatHeader";
import ProgressBar from "./ProgressBar";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

import "../../styles/interview/interviewChat.css";

export default function InterviewChat({
  interviewId,
  messages,
  company,
  role,
  currentQuestion,
  totalQuestions,
  completed,
  onSendAnswer,
  sending,
  error,
}) {

  return (
    <div className="chat-card">
      <ChatHeader
        company={company}
        role={role}
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
      />

      <ProgressBar current={currentQuestion} total={totalQuestions} />

      <div className="chat-body">
        {error && (
          <div className="chat-error">
            {error}
          </div>
        )}

        {messages.length === 0 && (
          <div
            style={{ color: "#9ca3af", textAlign: "center", marginTop: "2rem" }}
          >
            Waiting for the first interview question...
          </div>
        )}

        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}
      </div>

      {!completed ? (
        <MessageInput
          onSend={onSendAnswer}
          loading={sending}
        />
      ) : (
        <div className="interview-complete-banner">
          <h3>🎉 Interview Completed</h3>
          <p>Generating your interview evaluation...</p>
        </div>
      )}
    </div>
  );
}
