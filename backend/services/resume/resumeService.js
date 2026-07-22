// services/resume/resumeService.js

const prisma = require("../../lib/prisma");

async function getResumeHistory(userId) {
  return await prisma.resume.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      originalName: true,
      score: true,
      atsScore: true,
      feedback: true,
      createdAt: true,
    },
  });
}

async function getResumeText(resumeId, userId) {
    const resume = await findUserResume(resumeId, userId);

    return resume.resumeText;
}

async function findUserResume(resumeId, userId) {

    const resume =
        await prisma.resume.findUnique({
            where: {
                id: resumeId
            }
        });

    if (!resume || resume.userId !== userId) {
        throw new Error("Resume not found.");
    }

    return resume;
}

async function getResumeById(resumeId, userId) {
    return await findUserResume(resumeId, userId);
}

async function deleteResume(resumeId, userId) {
    const resume = await findUserResume(resumeId, userId);
  await prisma.resume.delete({
    where: {
      id: resumeId,
    },
  });

}

module.exports = {
  getResumeHistory,
  getResumeText,
  findUserResume,
  getResumeById,
  deleteResume,
};