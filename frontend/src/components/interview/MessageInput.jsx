import { useState } from "react";
import "../../styles/interview/messageInput.css";

export default function MessageInput({
  onSend,
  loading = false,
}) {
  const [answer, setAnswer] = useState("");

  function handleSend() {
    const trimmed = answer.trim();
    if (!trimmed) return;

    onSend?.(trimmed);
    setAnswer("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-footer">
      <textarea
        rows={3}
        placeholder="Type your answer... (Press Enter to send, Shift+Enter for a new line)"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        onClick={handleSend}
        disabled={loading || !answer.trim()}
      >
        {loading ? "Sending..." : "Next"}
      </button>
    </div>
  );
}