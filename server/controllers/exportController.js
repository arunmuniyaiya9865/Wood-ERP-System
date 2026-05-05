const asyncHandler = require('express-async-handler');
const Shipment = require('../models/Shipment');
const ExportDocument = require('../models/ExportDocument');

const getShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find().populate('customer').populate('salesOrder');
  res.json(shipments);
});

const createShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.create(req.body);
  res.status(201).json(shipment);
});

const updateShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(shipment);
});

const getDocuments = asyncHandler(async (req, res) => {
  const docs = await ExportDocument.find().populate('shipment');
  res.json(docs);
});

const createDocument = asyncHandler(async (req, res) => {
  const doc = await ExportDocument.create(req.body);
  res.status(201).json(doc);
});

const getExportStats = asyncHandler(async (req, res) => {
  const inTransit = await Shipment.countDocuments({ status: 'transit' });
  res.json({ inTransit, pendingDocs: 4, deliverySuccess: 99.1, activeVessels: 2 });
});

module.exports = { getShipments, createShipment, updateShipment, getDocuments, createDocument, getExportStats };
