const express = require('express');
const router = express.Router();
const { getInvoices, createInvoice, updateInvoice, getCashFlow, getFinanceStats } = require('../controllers/financeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/invoices', protect, getInvoices);
router.post('/invoices', protect, createInvoice);
router.put('/invoices/:id', protect, updateInvoice);
router.get('/cashflow', protect, getCashFlow);
router.get('/stats', protect, getFinanceStats);

module.exports = router;
