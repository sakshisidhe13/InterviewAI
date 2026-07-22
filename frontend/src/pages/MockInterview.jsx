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
      if (response.completed) {
        await finishInterviewFlow();
        return;
      }
    } catch (err) {
      console.error(err);
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
      setError(err.message || "Failed to start interview.");
    } finally {
      setStartingInterview(false);
    }
  }

  return (
    <div className="mock-interview-page">
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
