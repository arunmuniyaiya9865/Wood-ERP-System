const asyncHandler = require('express-async-handler');
const Invoice = require('../models/Invoice');

const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find().populate('customer').populate('salesOrder');
  res.json(invoices);
});

const createInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.create(req.body);
  res.status(201).json(invoice);
});

const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(invoice);
});

const getCashFlow = asyncHandler(async (req, res) => {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const data = months.map(month => ({
    month,
    inflow: Math.floor(Math.random() * 60000) + 30000,
    outflow: Math.floor(Math.random() * 40000) + 20000
  }));
  res.json(data);
});

const getFinanceStats = asyncHandler(async (req, res) => {
  res.json({
    ytdRevenue: 540000,
    netProfit: 125000,
    outstandingAR: 45000,
    cashPosition: 180000
  });
});

module.exports = { getInvoices, createInvoice, updateInvoice, getCashFlow, getFinanceStats };
