const interviewService = require("../services/interview/interviewService");
const resumeService = require("../services/resume/resumeService");
const questionGenerationService = require("../services/interview/questionGenerationService");
const interviewEvaluationService = require("../services/interview/interviewEvaluationService");
// ─────────────────────────────────────────────────────────────
// POST /api/interviews/start
// ─────────────────────────────────────────────────────────────
async function startInterview(req, res, next) {
  try {
    const { resumeId, role, company, difficulty } = req.body;

    const resume = await resumeService.findUserResume(resumeId, req.user.id);
    const interview = await interviewService.createInterview({
      userId: req.user.id,
      resumeId,
      role,
      company,
      difficulty,
    });

    const resumeText = resume.resumeText;

    const firstQuestion = await questionGenerationService.generateFirstQuestion(
      {
        resumeText,
        role,
        company,
        difficulty,
      },
    );

    await interviewService.updateTranscript(interview.id, req.user.id, {
      role: "assistant",
      content: firstQuestion.question,
      topic: firstQuestion.topic,
      difficulty: firstQuestion.difficulty,
      questionType: firstQuestion.questionType,
      questionNumber: 1,
      timestamp: new Date().toISOString(),
    });

    return res.status(201).json({
      message: "Interview created successfully.",
      interviewId: interview.id,
      question: firstQuestion,
    });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/interviews/:id/message
// ─────────────────────────────────────────────────────────────
async function sendMessage(req, res, next) {
  try {
    const { answer } = req.body;

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        message: "Answer is required.",
      });
    }
    const interview = await interviewService.getInterview(
      req.params.id,
      req.user.id,
    );

    if (interview.status !== "IN_PROGRESS") {
      return res.status(400).json({
        message: "Interview has already ended.",
      });
    }

    await interviewService.updateTranscript(interview.id, req.user.id, {
      role: "user",
      content: answer,
      questionNumber: interview.currentQuestion,
      timestamp: new Date().toISOString(),
    });

    const updatedInterview = await interviewService.getInterview(
      interview.id,
      req.user.id,
    );

    const nextQuestion = await questionGenerationService.generateNextQuestion({
      transcript: updatedInterview.transcript,
      role: updatedInterview.role,
      company: updatedInterview.company,
      difficulty: updatedInterview.difficulty,
      questionNumber: updatedInterview.currentQuestion + 1,
      totalQuestions: updatedInterview.totalQuestions,
    });

    if (nextQuestion.completed) {
      await interviewService.markCompleted(interview.id, req.user.id);

      return res.json({
        completed: true,
        interviewId: interview.id,
        message: "Interview completed.",
      });
    }

    await interviewService.updateTranscript(interview.id, req.user.id, {
      role: "assistant",
      content: nextQuestion.question,
      topic: nextQuestion.topic,
      difficulty: nextQuestion.difficulty,
      questionType: nextQuestion.questionType,
      questionNumber: updatedInterview.currentQuestion + 1,
      timestamp: new Date().toISOString(),
    });

    await interviewService.incrementQuestion(interview.id, req.user.id);
    return res.status(200).json({
      message: "Message stored successfully.",
      question: nextQuestion,
      currentQuestion: updatedInterview.currentQuestion + 1,
      totalQuestions: updatedInterview.totalQuestions,
      completed: false,
    });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/interviews/:id/end
// ─────────────────────────────────────────────────────────────
async function finishInterview(req, res, next) {
  try {
    const interview = await interviewService.getInterview(
      req.params.id,
      req.user.id,
    );

    if (interview.overallScore !== null) {
      return res.status(200).json({
        message: "Interview has already been evaluated.",
        interview,
      });
    }
    const evaluation = await interviewEvaluationService.evaluateInterview({
      transcript: interview.transcript,
      role: interview.role,
      company: interview.company,
    });

    const updatedInterview = await interviewService.finishInterview(
      interview.id,
      req.user.id,
      evaluation,
    );

    return res.status(200).json({
      message: "Interview evaluated successfully.",
      interview: updatedInterview,
      evaluation,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  startInterview,
  sendMessage,
  finishInterview,
};
