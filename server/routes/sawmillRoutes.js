const express = require('express');
const router = express.Router();
const { getMachines, updateMachine, getSawmillQueue, addToQueue, getSawmillStats } = require('../controllers/sawmillController');
const { protect } = require('../middleware/authMiddleware');

router.get('/machines', protect, getMachines);
router.put('/machines/:id', protect, updateMachine);
router.get('/queue', protect, getSawmillQueue);
router.post('/queue', protect, addToQueue);
router.get('/stats', protect, getSawmillStats);

module.exports = router;
