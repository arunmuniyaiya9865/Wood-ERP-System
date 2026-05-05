const express = require('express');
const router = express.Router();
const { getWorkOrders, createWorkOrder, updateWorkOrder, deleteWorkOrder, getProductionStats } = require('../controllers/productionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/work-orders', protect, getWorkOrders);
router.post('/work-orders', protect, createWorkOrder);
router.put('/work-orders/:id', protect, updateWorkOrder);
router.delete('/work-orders/:id', protect, deleteWorkOrder);
router.get('/stats', protect, getProductionStats);

module.exports = router;
