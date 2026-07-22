import "../../styles/interview/messageBubble.css";

export default function MessageBubble({
  role,
  content,
}) {
  const assistant = role === "assistant";

  return (
    <div
      className={`message-row ${
        assistant ? "assistant" : "user"
      }`}
    >
      <div className="message-bubble">
        <p>{content}</p>

      </div>
    </div>
  );
}