const User = require('../models/User');
const Progress = require('../models/Progress');
const roadmaps = require('../data/roadmaps');

// ✅ 1. Get all users who requested mentorship
exports.getMentorRequests = async (req, res) => {
  try {
    const requests = await User.find({ role: 'student', requestedMentor: true });
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests', error: err.message });
  }
};

// ✅ 2. Approve mentorship for a student
exports.approveMentorship = async (req, res) => {
  const { studentId } = req.body;
  try {
    const student = await User.findByIdAndUpdate(
      studentId,
      { isApprovedByMentor: true },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json({ message: 'Mentorship approved', student });
  } catch (err) {
    res.status(500).json({ message: 'Approval failed', error: err.message });
  }
};

// ✅ 3. Update roadmap structure for a career (admin/mentor wide edit)
exports.updateUserRoadmap = async (req, res) => {
  const { studentId, newRoadmap } = req.body;
  try {
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Update roadmap for that student's career globally
    roadmaps[student.career] = newRoadmap;

    res.json({ message: 'Roadmap updated for career: ' + student.career });
  } catch (err) {
    res.status(500).json({ message: 'Roadmap update failed', error: err.message });
  }
};

// ✅ 4. Get students assigned to a mentor (can be filtered by mentorId later)
exports.getAssignedStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', career: { $exists: true } }).select('-password');
    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get assigned students', error: err.message });
  }
};

// ✅ 5. Update a specific student’s completed steps (progress)
exports.updateStudentRoadmap = async (req, res) => {
  const { userId } = req.params;
  const { completedSteps } = req.body;

  try {
    let progress = await Progress.findOne({ user: userId });

    if (!progress) {
      progress = new Progress({ user: userId, completedSteps });
    } else {
      const all = new Set([...progress.completedSteps, ...completedSteps]);
      progress.completedSteps = [...all];
    }

    await progress.save();
    res.json({ message: 'Student roadmap progress updated', progress });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update roadmap progress', error: err.message });
  }
};
