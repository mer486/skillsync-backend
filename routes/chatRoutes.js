const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { auth } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// Students request chat
router.post('/request', auth, chatController.requestChat);

// Mentors & admins view requests
router.get('/all', auth, allowRoles('admin', 'mentor'), chatController.getAllRequests);

module.exports = router;
