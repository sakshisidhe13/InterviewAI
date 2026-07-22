const prisma = require("../../lib/prisma");

async function createInterview({
  userId,
  resumeId,
  role,
  company,
  difficulty,
}) {
  // Use Prisma enum if available for status
  const status =
    prisma.InterviewStatus && prisma.InterviewStatus.IN_PROGRESS
      ? prisma.InterviewStatus.IN_PROGRESS
      : "IN_PROGRESS";
  return await prisma.interview.create({
    data: {
      userId,
      resumeId,
      role,
      company,
      difficulty,
      status,
      currentQuestion: 1,
      totalQuestions: 8,
      transcript: [],
      feedback: null,
    },
  });
}

async function getInterview(interviewId, userId) {
  const interview = await prisma.interview.findUnique({
    where: {
      id: interviewId,
    },
  });

  if (!interview || interview.userId !== userId) {
    throw new Error("Interview not found.");
  }

  return interview;
}

async function incrementQuestion(interviewId, userId) {
  return prisma.interview.update({
    where: {
      id: interviewId,
      userId,
    },
    data: {
      currentQuestion: {
        increment: 1,
      },
    },
  });
}

async function markCompleted(interviewId, userId) {
  await getInterview(interviewId, userId);

  const status =
    prisma.InterviewStatus && prisma.InterviewStatus.COMPLETED
      ? prisma.InterviewStatus.COMPLETED
      : "COMPLETED";

  return prisma.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      status,
    },
  });
}

async function updateTranscript(interviewId, userId, message) {
  const interview = await getInterview(interviewId, userId);

  const transcript = interview.transcript || [];

  return await prisma.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      transcript: [...transcript, message],
    },
  });
}

async function finishInterview(interviewId, userId, data) {
  await getInterview(interviewId, userId);
  // Use Prisma enum if available for status
  const status =
    prisma.InterviewStatus && prisma.InterviewStatus.COMPLETED
      ? prisma.InterviewStatus.COMPLETED
      : "COMPLETED";
  return await prisma.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      status,
      overallScore: data.overallScore,
      communicationScore: data.communicationScore,
      technicalScore: data.technicalScore,
      confidenceScore: data.confidenceScore,
      summary: data.summary,
      recommendation: data.recommendation,
      feedback: data.feedback || {
        strengths: [],
        improvements: [],
        recommendationReason: "",
        questionFeedback: [],
      },
    },
  });
}
async function deleteInterview(interviewId, userId) {
  await getInterview(interviewId, userId);

  return prisma.interview.delete({
    where: {
      id: interviewId,
    },
  });
}

module.exports = {
  createInterview,
  getInterview,
  markCompleted,
  incrementQuestion,
  updateTranscript,
  finishInterview,
  deleteInterview,
};