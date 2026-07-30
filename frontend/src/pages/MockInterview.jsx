import { useEffect, useState } from "react";
import { api } from "../lib/api";
import InterviewSetupForm from "../components/interview/InterviewSetupForm";
import "../styles/interview/mockInterview.css";
import InterviewChat from "../components/interview/InterviewChat";
import { useNavigate } from "react-router-dom";

export default function MockInterview() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [resumeId, setResumeId] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");

  const [startingInterview, setStartingInterview] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(8);
  const [completed, setCompleted] = useState(false);
  const [sending, setSending] = useState(false);
  const [showAiUnavailable, setShowAiUnavailable] = useState(false);

  function resetInterview() {
    setInterviewId(null);
    setMessages([]);
    setInterviewStarted(false);
    setCurrentQuestion(1);
    setTotalQuestions(8);
    setCompleted(false);
    setSending(false);
    setError("");
  }

  async function finishInterviewFlow() {
    setCompleted(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = await api.finishInterview(interviewId);

    console.log("Interview evaluation:", result);

    navigate(`/interviews/${interviewId}`);
  }

  async function handleSendAnswer(answer) {
    setSending(true);
    try {
      setError("");
      setMessages((prev) => [...prev, { role: "user", content: answer }]);
      const response = await api.sendInterviewMessage(interviewId, answer);

      if (response.completed) {
        await finishInterviewFlow();
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.question.question,
          topic: response.question.topic,
          difficulty: response.question.difficulty,
          questionType: response.question.questionType,
        },
      ]);

      setCurrentQuestion(response.currentQuestion);

      if (response.totalQuestions) {
        setTotalQuestions(response.totalQuestions);
      }
    } catch (err) {
      if (err.code === "AI_UNAVAILABLE") {
        setShowAiUnavailable(true);
        return;
      }

      setError(err.message || "Failed to send answer.");
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    async function loadResumes() {
      try {
        const data = await api.getResumes();
        setResumes(data.resumes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadResumes();
  }, []);

  async function handleStartInterview() {
    if (!resumeId) {
      alert("Please select a resume.");
      return;
    }

    if (!company.trim()) {
      alert("Please enter a company name.");
      return;
    }

    if (!role.trim()) {
      alert("Please enter a role.");
      return;
    }

    try {
      setStartingInterview(true);
      setError("");

      const response = await api.startInterview({
        resumeId,
        company,
        role,
        difficulty,
      });

      setInterviewId(response.interviewId);

      setMessages([
        {
          role: "assistant",
          content: response.question.question,
          topic: response.question.topic,
          difficulty: response.question.difficulty,
          questionType: response.question.questionType,
        },
      ]);
      setCurrentQuestion(1);
      setTotalQuestions(response.totalQuestions || 8);
      setCompleted(false);

      setInterviewStarted(true);

      console.log("Interview created:", response.interviewId);
      console.log("First question:", response.question);
    } catch (err) {
      if (err.code === "AI_UNAVAILABLE") {
        setShowAiUnavailable(true);
        return;
      }

      setError(err.message || "Failed to start interview.");
    } finally {
      setStartingInterview(false);
    }
  }

  return (
    <div className="mock-interview-page">
      {showAiUnavailable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl backdrop-blur">
            <h2 className="mb-3 text-2xl font-semibold text-white">
              ⚠️AI Service Unavailable
            </h2>
            <p className="mb-8 leading-7 text-slate-300">
              The AI is currently not available. Your interview has not been saved. Please try again later.
            </p>
            <button
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-medium text-white transition hover:border-violet-500 hover:bg-slate-700"
              onClick={() => {
                setShowAiUnavailable(false);
                resetInterview();
                navigate("/mock-interview", { replace: true });
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {interviewStarted ? (
        <InterviewChat
          interviewId={interviewId}
          messages={messages}
          company={company}
          role={role}
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
          completed={completed}
          onSendAnswer={handleSendAnswer}
          sending={sending}
          error={error}
        />
      ) : (
        <InterviewSetupForm
          resumes={resumes}
          loading={loading}
          error={error}
          resumeId={resumeId}
          setResumeId={setResumeId}
          company={company}
          setCompany={setCompany}
          role={role}
          setRole={setRole}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          startingInterview={startingInterview}
          onStartInterview={handleStartInterview}
        />
      )}
    </div>
  );
}
