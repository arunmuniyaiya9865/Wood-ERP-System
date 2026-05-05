const express = require('express');
const router = express.Router();
const { getShipments, createShipment, updateShipment, getDocuments, createDocument, getExportStats } = require('../controllers/exportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/shipments', protect, getShipments);
router.post('/shipments', protect, createShipment);
router.put('/shipments/:id', protect, updateShipment);
router.get('/documents', protect, getDocuments);
router.post('/documents', protect, createDocument);
router.get('/stats', protect, getExportStats);

module.exports = router;
