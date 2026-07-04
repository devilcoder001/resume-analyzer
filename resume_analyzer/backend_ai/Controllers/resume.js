const ResumeModel = require('../Models/resume');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const UserModel = require('../Models/user');

// Simple scoring: percentage of JD words that appear in resume text
function scoreResume(resumeText = '', jobDesc = '') {
    const resumeWords = new Set(
        resumeText
            .replace(/[^a-zA-Z0-9\s]/g, ' ')
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean)
    );
    const jdWords = jobDesc
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
    if (jdWords.length === 0) return 0;
    let match = 0;
    jdWords.forEach((w) => {
        if (resumeWords.has(w)) match++;
    });
    return Math.round((match / jdWords.length) * 100);
}

exports.addResume = async (req, res) => {
    try {
        const { job_desc, user } = req.body;
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const uploadPath = req.file.path; // multer diskStorage
        const pdfBuffer = fs.readFileSync(uploadPath);

        const pdfData = await pdfParse(pdfBuffer).catch(() => ({ text: '' }));

        const score = scoreResume(pdfData.text || '', job_desc || '');
        const feedback = `Simple keyword match score: ${score}`;

        // Resolve user id: if user is an id, use it; if email, find user
        let userId = null;
        if (user) {
            const foundById = await UserModel.findById(user).catch(() => null);
            if (foundById) userId = foundById._id;
            else {
                const foundByEmail = await UserModel.findOne({ email: user }).catch(() => null);
                if (foundByEmail) userId = foundByEmail._id;
            }
        }

        const newResume = new ResumeModel({
            user: userId,
            resume_name: req.file.filename,
            job_desc: job_desc || '',
            score: String(score),
            feedback,
        });

        await newResume.save();

        res.status(201).json({ message: 'Analysis ready', data: newResume });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.getAllResumesForUser = async (req, res) => {
    try {
        const userParam = req.params.user;
        if (!userParam) return res.status(400).json({ error: 'user param required' });

        // accept id or email
        let userId = userParam;
        const maybeUser = await UserModel.findOne({ email: userParam }).catch(() => null);
        if (maybeUser) userId = maybeUser._id;

        const list = await ResumeModel.find({ user: userId }).sort({ createdAt: -1 });
        return res.status(200).json({ data: list });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.getResumeForAdmin = async (req, res) => {
    try {
        const list = await ResumeModel.find().sort({ createdAt: -1 }).populate('user', 'name email');
        return res.status(200).json({ data: list });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error', message: err.message });
    }
};
