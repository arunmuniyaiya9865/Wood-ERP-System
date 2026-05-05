const express = require('express');
const router = express.Router();
const { getKPITrends, getRevenueTrend, getProductionAnalytics, getAnalyticsStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/kpi-trends', protect, getKPITrends);
router.get('/revenue-trend', protect, getRevenueTrend);
router.get('/production', protect, getProductionAnalytics);
router.get('/stats', protect, getAnalyticsStats);

module.exports = router;
