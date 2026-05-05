const express = require('express');
const router = express.Router();
const { getLogs, createLog, updateLog, deleteLog, getLogStats } = require('../controllers/logsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getLogs);
router.post('/', protect, createLog);
router.put('/:id', protect, updateLog);
router.delete('/:id', protect, deleteLog);
router.get('/stats', protect, getLogStats);

module.exports = router;
