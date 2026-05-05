const asyncHandler = require('express-async-handler');
const Log = require('../models/Log');

// @desc    Get all logs
// @route   GET /api/v1/logs
const getLogs = asyncHandler(async (req, res) => {
  const { species, grade, status, location } = req.query;
  const query = {};
  if (species) query.species = species;
  if (grade) query.grade = grade;
  if (status) query.status = status;
  if (location) query.location = location;
  const logs = await Log.find(query);
  res.json(logs);
});

// @desc    Add log
// @route   POST /api/v1/logs
const createLog = asyncHandler(async (req, res) => {
  const log = await Log.create(req.body);
  res.status(201).json(log);
});

// @desc    Update log
// @route   PUT /api/v1/logs/:id
const updateLog = asyncHandler(async (req, res) => {
  const log = await Log.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(log);
});

// @desc    Delete log
// @route   DELETE /api/v1/logs/:id
const deleteLog = asyncHandler(async (req, res) => {
  await Log.findByIdAndDelete(req.params.id);
  res.json({ message: 'Log removed' });
});

// @desc    Get log statistics
// @route   GET /api/v1/logs/stats
const getLogStats = asyncHandler(async (req, res) => {
  const totalLogs = await Log.countDocuments();
  const totalVolumeData = await Log.aggregate([{ $group: { _id: null, total: { $sum: '$volume' } } }]);
  const arrivalsToday = await Log.countDocuments({
    receivedDate: { $gte: new Date().setHours(0,0,0,0) }
  });

  res.json({
    totalLogs,
    totalVolume: totalVolumeData.length > 0 ? totalVolumeData[0].total : 0,
    arrivalsToday,
    fscCertifiedPercentage: 85 // Mock
  });
});

module.exports = { getLogs, createLog, updateLog, deleteLog, getLogStats };
