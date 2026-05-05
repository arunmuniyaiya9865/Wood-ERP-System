const asyncHandler = require('express-async-handler');
const Supplier = require('../models/Supplier');
const PurchaseOrder = require('../models/PurchaseOrder');

// @desc    Get all suppliers
// @route   GET /api/v1/procurement/suppliers
const getSuppliers = asyncHandler(async (req, res) => {
  const { status, country, species } = req.query;
  const query = {};
  if (status) query.status = status;
  if (country) query.country = country;
  if (species) query.species = { $in: [species] };
  const suppliers = await Supplier.find(query);
  res.json(suppliers);
});

// @desc    Add supplier
// @route   POST /api/v1/procurement/suppliers
const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.create(req.body);
  res.status(201).json(supplier);
});

// @desc    Update supplier
// @route   PUT /api/v1/procurement/suppliers/:id
const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(supplier);
});

// @desc    Delete supplier
// @route   DELETE /api/v1/procurement/suppliers/:id
const deleteSupplier = asyncHandler(async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.json({ message: 'Supplier removed' });
});

// @desc    Get all purchase orders
// @route   GET /api/v1/procurement/purchase-orders
const getPurchaseOrders = asyncHandler(async (req, res) => {
  const { status, supplier } = req.query;
  const query = {};
  if (status) query.status = status;
  if (supplier) query.supplier = supplier;
  const pos = await PurchaseOrder.find(query).populate('supplier');
  res.json(pos);
});

// @desc    Create PO
// @route   POST /api/v1/procurement/purchase-orders
const createPurchaseOrder = asyncHandler(async (req, res) => {
  const po = await PurchaseOrder.create(req.body);
  res.status(201).json(po);
});

// @desc    Update PO
// @route   PUT /api/v1/procurement/purchase-orders/:id
const updatePurchaseOrder = asyncHandler(async (req, res) => {
  const po = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(po);
});

// @desc    Delete PO
// @route   DELETE /api/v1/procurement/purchase-orders/:id
const deletePurchaseOrder = asyncHandler(async (req, res) => {
  await PurchaseOrder.findByIdAndDelete(req.params.id);
  res.json({ message: 'PO removed' });
});

module.exports = {
  getSuppliers, createSupplier, updateSupplier, deleteSupplier,
  getPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder
};
