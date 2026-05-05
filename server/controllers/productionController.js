const asyncHandler = require('express-async-handler');
const WorkOrder = require('../models/WorkOrder');

const getWorkOrders = asyncHandler(async (req, res) => {
  const { status, team, species } = req.query;
  const query = {};
  if (status) query.status = status;
  if (team) query.team = team;
  if (species) query.species = species;
  const wos = await WorkOrder.find(query);
  res.json(wos);
});

const createWorkOrder = asyncHandler(async (req, res) => {
  const wo = await WorkOrder.create(req.body);
  res.status(201).json(wo);
});

const updateWorkOrder = asyncHandler(async (req, res) => {
  const wo = await WorkOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(wo);
});

const deleteWorkOrder = asyncHandler(async (req, res) => {
  await WorkOrder.findByIdAndDelete(req.params.id);
  res.json({ message: 'Work order removed' });
});

const getProductionStats = asyncHandler(async (req, res) => {
  const activeCount = await WorkOrder.countDocuments({ status: 'in_progress' });
  const completedToday = await WorkOrder.countDocuments({ 
    status: 'completed', 
    updatedAt: { $gte: new Date().setHours(0,0,0,0) } 
  });
  res.json({ activeCount, completedToday, throughput: 145, efficiency: 89 });
});

module.exports = { getWorkOrders, createWorkOrder, updateWorkOrder, deleteWorkOrder, getProductionStats };
