

import { useState } from "react";
import { ChevronDown, MessageSquareQuote, Star } from "lucide-react";

export default function FeedbackAccordion({ feedback = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!feedback.length) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8 text-center text-slate-400">
        No question-wise feedback available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#111827] to-[#0f172a]"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-slate-800/40"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400">
                  <MessageSquareQuote size={20} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {item.question || `Question ${index + 1}`}
                  </h3>

                  {item.rating !== undefined && (
                    <div className="mt-2 flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          fill={i < item.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <ChevronDown
                size={22}
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="border-t border-slate-800 px-6 py-6">
                <p className="leading-8 text-slate-300">
                  {item.feedback || item.comment || "No feedback available."}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}