const express = require('express');
const router = express.Router();

const mentorController = require('../controllers/mentorController');
const { auth } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// ✅ Old working routes
router.get('/requests', auth, allowRoles('mentor'), mentorController.getMentorRequests);
router.post('/approve', auth, allowRoles('mentor'), mentorController.approveMentorship);
router.put('/update-roadmap', auth, allowRoles('mentor'), mentorController.updateUserRoadmap);

// ✅ New routes added properly
router.get('/students', auth, allowRoles('mentor', 'admin'), mentorController.getAssignedStudents);
router.put('/roadmap/:userId', auth, allowRoles('mentor', 'admin'), mentorController.updateStudentRoadmap);

module.exports = router;
