const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');
const SalesOrder = require('../models/SalesOrder');

const getCustomers = asyncHandler(async (req, res) => {
  const { stage, sector, country } = req.query;
  const query = {};
  if (stage) query.stage = stage;
  if (sector) query.sector = sector;
  if (country) query.country = country;
  const customers = await Customer.find(query).populate('assignedRep');
  res.json(customers);
});

const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json(customer);
});

const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(customer);
});

const deleteCustomer = asyncHandler(async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ message: 'Customer removed' });
});

const getSalesOrders = asyncHandler(async (req, res) => {
  const orders = await SalesOrder.find().populate('customer');
  res.json(orders);
});

const createSalesOrder = asyncHandler(async (req, res) => {
  const order = await SalesOrder.create(req.body);
  res.status(201).json(order);
});

const getPipeline = asyncHandler(async (req, res) => {
  const pipeline = await Customer.aggregate([
    { $group: { _id: '$stage', count: { $sum: 1 }, value: { $sum: '$ytdRevenue' } } }
  ]);
  res.json(pipeline);
});

const getSalesStats = asyncHandler(async (req, res) => {
  const totalRev = await SalesOrder.aggregate([{ $group: { _id: null, total: { $sum: '$totalValue' } } }]);
  res.json({
    revenue: totalRev.length > 0 ? totalRev[0].total : 0,
    activeLeads: 42,
    conversionRate: 18.5,
    avgDealSize: 4500
  });
});

module.exports = { getCustomers, createCustomer, updateCustomer, deleteCustomer, getSalesOrders, createSalesOrder, getPipeline, getSalesStats };
