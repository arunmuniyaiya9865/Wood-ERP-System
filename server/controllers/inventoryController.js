const asyncHandler = require('express-async-handler');
const InventoryItem = require('../models/InventoryItem');

// @desc    Get all inventory
// @route   GET /api/v1/inventory
const getInventory = asyncHandler(async (req, res) => {
  const { location, unit } = req.query;
  const query = {};
  if (location) query.location = location;
  if (unit) query.unit = unit;
  const items = await InventoryItem.find(query);
  res.json(items);
});

// @desc    Add inventory
// @route   POST /api/v1/inventory
const createInventoryItem = asyncHandler(async (req, res) => {
  const item = await InventoryItem.create(req.body);
  res.status(201).json(item);
});

// @desc    Update inventory
// @route   PUT /api/v1/inventory/:id
const updateInventoryItem = asyncHandler(async (req, res) => {
  const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

// @desc    Delete inventory
// @route   DELETE /api/v1/inventory/:id
const deleteInventoryItem = asyncHandler(async (req, res) => {
  await InventoryItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Inventory item removed' });
});

// @desc    Get inventory stats
// @route   GET /api/v1/inventory/stats
const getInventoryStats = asyncHandler(async (req, res) => {
  const items = await InventoryItem.find();
  const totalValue = items.reduce((acc, item) => acc + item.totalValue, 0);
  const reservedValue = items.reduce((acc, item) => acc + (item.reserved * item.unitValue), 0);
  const lowStockCount = items.filter(item => item.inStock < 20).length;

  res.json({
    totalSKUs: items.length,
    stockValue: totalValue,
    reservedValue,
    lowStockCount
  });
});

module.exports = {
  getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem, getInventoryStats
};
