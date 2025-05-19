const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { auth } = require('../middleware/authMiddleware');
router.post('/update', auth, progressController.updateProgress);
router.get('/', auth, progressController.getProgress);
router.put('/', auth, progressController.updateProgress);


const controller = require('../controllers/progressController');

router.get('/', auth, controller.getProgress);
router.put('/', auth, controller.updateProgress);

module.exports = router;


// POST /api/progress - Save step progress
router.post('/', auth, progressController.updateProgress);



module.exports = router;
