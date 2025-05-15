const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth } = require('../middleware/authMiddleware');
const { restrictToRole } = require('../middleware/roleMiddleware');

// ✅ Only admins can access these endpoints
router.get('/users', auth, restrictToRole('admin'), adminController.getAllUsers);
router.delete('/user/:id', auth, restrictToRole('admin'), adminController.deleteUser);
router.put('/user/:id/promote', auth, restrictToRole('admin'), adminController.promoteToMentor);
router.get('/stats', auth, restrictToRole('admin'), adminController.getSystemStats);

module.exports = router;
