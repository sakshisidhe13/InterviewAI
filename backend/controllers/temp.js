const resumeAnalysisService = require("../services/resume/resumeAnalysisService.js");

async function analyzeResume(req, res, next) {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a PDF resume."
            });
        }

        const result = await resumeAnalysisService.analyzeResume(
            req.file,
            req.user.id
        );

        return res.status(200).json(result);

    } catch(err){
        next(err);
    }

}

module.exports = {
    analyzeResume
};