const express = require('express');
const router = express.Router();
const { getRuns, runOptimizer, getOptimizerStats } = require('../controllers/optimizerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/runs', protect, getRuns);
router.post('/run', protect, runOptimizer);
router.get('/stats', protect, getOptimizerStats);

module.exports = router;
