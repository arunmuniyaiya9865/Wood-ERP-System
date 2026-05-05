const express = require('express');
const router = express.Router();
const { 
  getSuppliers, createSupplier, updateSupplier, deleteSupplier,
  getPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder 
} = require('../controllers/procurementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/suppliers', protect, getSuppliers);
router.post('/suppliers', protect, createSupplier);
router.put('/suppliers/:id', protect, updateSupplier);
router.delete('/suppliers/:id', protect, deleteSupplier);

router.get('/purchase-orders', protect, getPurchaseOrders);
router.post('/purchase-orders', protect, createPurchaseOrder);
router.put('/purchase-orders/:id', protect, updatePurchaseOrder);
router.delete('/purchase-orders/:id', protect, deletePurchaseOrder);

module.exports = router;
