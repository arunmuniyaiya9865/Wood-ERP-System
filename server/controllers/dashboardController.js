const asyncHandler = require('express-async-handler');
const SalesOrder = require('../models/SalesOrder');
const Log = require('../models/Log');
const InventoryItem = require('../models/InventoryItem');
const OptimizationRun = require('../models/OptimizationRun');

// @desc    Get dashboard KPIs
// @route   GET /api/v1/dashboard/stats
const getStats = asyncHandler(async (req, res) => {
  const totalRevenue = await SalesOrder.aggregate([{ $group: { _id: null, total: { $sum: '$totalValue' } } }]);
  const totalOrders = await SalesOrder.countDocuments();
  const logStock = await Log.countDocuments({ status: 'available' });
  
  const yieldRateData = await OptimizationRun.aggregate([{ $group: { _id: null, avg: { $avg: '$yieldRate' } } }]);
  const avgYield = yieldRateData.length > 0 ? yieldRateData[0].avg : 0;

  res.json({
    revenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    orders: totalOrders,
    logStock,
    yieldRate: avgYield,
    trend: { revenue: 12.5, orders: 8.2, yield: 2.1 } 
  });
});

// @desc    Get revenue chart data
// @route   GET /api/v1/dashboard/revenue
const getRevenueData = asyncHandler(async (req, res) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 50000) + 20000,
    cost: Math.floor(Math.random() * 30000) + 10000
  }));
  res.json(data);
});

// @desc    Get weekly production by species
// @route   GET /api/v1/dashboard/production
const getProductionData = asyncHandler(async (req, res) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = days.map(day => ({
    day,
    Pine: Math.floor(Math.random() * 100) + 50,
    Oak: Math.floor(Math.random() * 80) + 30,
    Teak: Math.floor(Math.random() * 60) + 20
  }));
  res.json(data);
});

// @desc    Get species mix breakdown
// @route   GET /api/v1/dashboard/species-mix
const getSpeciesMix = asyncHandler(async (req, res) => {
  const logs = await Log.aggregate([
    { $group: { _id: '$species', value: { $sum: 1 } } }
  ]);
  const formatted = logs.map(l => ({ name: l._id, value: l.value }));
  res.json(formatted);
});

// @desc    Get recent orders
// @route   GET /api/v1/dashboard/recent-orders
const getRecentOrders = asyncHandler(async (req, res) => {
  const orders = await SalesOrder.find().populate('customer').sort({ createdAt: -1 }).limit(5);
  res.json(orders);
});

// @desc    Get stock alerts
// @route   GET /api/v1/dashboard/stock-alerts
const getStockAlerts = asyncHandler(async (req, res) => {
  const items = await InventoryItem.find({ inStock: { $lt: 20 } }).limit(5);
  res.json(items);
});

module.exports = {
  getStats,
  getRevenueData,
  getProductionData,
  getSpeciesMix,
  getRecentOrders,
  getStockAlerts
};
