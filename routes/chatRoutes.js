const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { allowRoles } = require('../middleware/roleMiddleware');
const { auth } = require('../middleware/authMiddleware');

// Students request chat
router.post('/request', auth, chatController.requestChat);

// Mentors & admins view requests
router.get('/all', auth, allowRoles('admin', 'mentor'), chatController.getAllRequests);

module.exports = router;
