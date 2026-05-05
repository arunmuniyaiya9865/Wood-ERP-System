const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, updateCustomer, deleteCustomer, getSalesOrders, createSalesOrder, getPipeline, getSalesStats } = require('../controllers/salesController');
const { protect } = require('../middleware/authMiddleware');

router.get('/customers', protect, getCustomers);
router.post('/customers', protect, createCustomer);
router.put('/customers/:id', protect, updateCustomer);
router.delete('/customers/:id', protect, deleteCustomer);
router.get('/orders', protect, getSalesOrders);
router.post('/orders', protect, createSalesOrder);
router.get('/pipeline', protect, getPipeline);
router.get('/stats', protect, getSalesStats);

module.exports = router;
