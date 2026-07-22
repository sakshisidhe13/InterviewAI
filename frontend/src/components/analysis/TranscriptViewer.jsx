import { Bot, User, MessageSquare, Hash } from "lucide-react";

export default function TranscriptViewer({ transcript = [] }) {
  if (!transcript.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-8 text-center text-slate-400">
        No transcript available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transcript.map((message, index) => {
        const isAssistant = message.role === "assistant";

        return (
          <div
            key={index}
            className={`rounded-2xl border p-5 transition-colors ${
              isAssistant
                ? "border-blue-500/20 bg-slate-900/30"
                : "border-emerald-500/20 bg-slate-900/40"
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-semibold text-slate-100">
                {isAssistant ? (
                  <Bot className="h-5 w-5 text-blue-400" />
                ) : (
                  <User className="h-5 w-5 text-emerald-400" />
                )}
                <span>{isAssistant ? "AI Interviewer" : "Your Answer"}</span>
              </div>

              {message.questionNumber && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Hash className="h-4 w-4" />
                  Q{message.questionNumber}
                </div>
              )}
            </div>

            {isAssistant && (
              <div className="mb-3 flex flex-wrap gap-2">
                {message.topic && (
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                    {message.topic}
                  </span>
                )}

                {message.difficulty && (
                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
                    {message.difficulty}
                  </span>
                )}

                {message.questionType && (
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                    {message.questionType}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-start gap-3">
              <MessageSquare className="mt-1 h-5 w-5 flex-shrink-0 text-slate-500" />
              <p className="whitespace-pre-wrap leading-7 text-slate-300">
                {message.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}