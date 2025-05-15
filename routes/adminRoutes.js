// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const { restrictToRole } = require('../middleware/roleMiddleware'); // ✅ correct
const { auth } = require('../middleware/authMiddleware');

// ✅ Only admin can access the following routes
router.get('/users', auth, restrictToRole('admin'), adminController.getAllUsers);
router.delete('/user/:id', auth, restrictToRole('admin'), adminController.deleteUser);
router.get('/stats', auth, restrictToRole('admin'), adminController.getSystemStats);

module.exports = router;
