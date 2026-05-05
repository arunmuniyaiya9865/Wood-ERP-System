const asyncHandler = require('express-async-handler');
const OptimizationRun = require('../models/OptimizationRun');
const Log = require('../models/Log');

const getRuns = asyncHandler(async (req, res) => {
  const runs = await OptimizationRun.find().populate('log').sort({ createdAt: -1 });
  res.json(runs);
});

const runOptimizer = asyncHandler(async (req, res) => {
  const { logId, targetProduct } = req.body;
  
  // Simulate heavy computation delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const yieldRate = parseFloat((Math.random() * (95 - 82) + 82).toFixed(2));
  const wasteRate = parseFloat((100 - yieldRate).toFixed(2));
  const valueSaved = Math.floor(Math.random() * 500) + 100;
  const patterns = Math.floor(Math.random() * 5) + 3;

  const run = await OptimizationRun.create({
    runId: 'RUN-' + Math.floor(Math.random() * 1000000),
    log: logId,
    targetProduct,
    yieldRate,
    wasteRate,
    valueSaved,
    patterns
  });

  res.status(201).json(run);
});

const getOptimizerStats = asyncHandler(async (req, res) => {
  const data = await OptimizationRun.aggregate([
    { $group: { _id: null, avgYield: { $avg: '$yieldRate' }, totalSaved: { $sum: '$valueSaved' } } }
  ]);
  res.json({
    avgYield: data.length > 0 ? data[0].avgYield : 88.5,
    totalSaved: data.length > 0 ? data[0].totalSaved : 12500,
    bestRun: 94.2
  });
});

module.exports = { getRuns, runOptimizer, getOptimizerStats };
