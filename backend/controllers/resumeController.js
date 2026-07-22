//resumeController.js
const resumeService = require("../services/resume/resumeService.js");

async function getResumes(req, res, next) {
  try {
    const resumes = await resumeService.getResumeHistory(req.user.id);

    return res.json({ resumes });

  } catch (err) {
    next(err);
  }
}

async function getResumeById(req, res, next) {
    try {

        const resume =
            await resumeService.getResumeById(
                req.params.id,
                req.user.id
            );

        return res.json({ resume });

    } catch(err){
        next(err);
    }
}

async function deleteResume(req, res, next) {
  try {

    await resumeService.deleteResume(
      req.params.id,
      req.user.id
    );

    return res.json({
      success: true,
      message: "Resume deleted."
    });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  getResumes,
  getResumeById,
  deleteResume,
};