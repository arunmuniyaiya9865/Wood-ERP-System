const express = require('express');
const router = express.Router();
const { 
  getStats, 
  getRevenueData, 
  getProductionData, 
  getSpeciesMix, 
  getRecentOrders, 
  getStockAlerts 
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getStats);
router.get('/revenue', protect, getRevenueData);
router.get('/production', protect, getProductionData);
router.get('/species-mix', protect, getSpeciesMix);
router.get('/recent-orders', protect, getRecentOrders);
router.get('/stock-alerts', protect, getStockAlerts);

module.exports = router;
