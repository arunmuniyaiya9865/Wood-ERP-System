const asyncHandler = require('express-async-handler');
const Machine = require('../models/Machine');
const Log = require('../models/Log');

const getMachines = asyncHandler(async (req, res) => {
  const machines = await Machine.find().populate('operator').populate('currentLog');
  res.json(machines);
});

const updateMachine = asyncHandler(async (req, res) => {
  const machine = await Machine.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(machine);
});

const getSawmillQueue = asyncHandler(async (req, res) => {
  const queue = await Log.find({ status: 'in_processing' }).sort({ updatedAt: 1 });
  res.json(queue);
});

const addToQueue = asyncHandler(async (req, res) => {
  const log = await Log.findByIdAndUpdate(req.body.logId, { status: 'in_processing' }, { new: true });
  res.json(log);
});

const getSawmillStats = asyncHandler(async (req, res) => {
  const count = await Machine.countDocuments({ status: 'active' });
  const idle = await Machine.countDocuments({ status: 'idle' });
  res.json({ activeCount: count, idleCount: idle, uptime: 94 });
});

module.exports = { getMachines, updateMachine, getSawmillQueue, addToQueue, getSawmillStats };
