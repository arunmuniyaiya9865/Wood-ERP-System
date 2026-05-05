const express = require('express');
const router = express.Router();
const { 
  getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem, getInventoryStats 
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getInventory);
router.post('/', protect, createInventoryItem);
router.put('/:id', protect, updateInventoryItem);
router.delete('/:id', protect, deleteInventoryItem);
router.get('/stats', protect, getInventoryStats);

module.exports = router;
