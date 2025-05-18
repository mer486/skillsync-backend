const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');

router.post('/register', registerUser);
const { auth } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
router.post('/select-career', auth, userController.selectCareer);

router.put('/career', auth, userController.setCareer); // ✅ Add this

module.exports = router;





