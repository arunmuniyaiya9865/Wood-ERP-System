const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true, unique: true },
  destination: { type: String, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  cargo: { type: String },
  vessel: { type: String },
  eta: { type: Date },
  status: { type: String, enum: ['loading', 'transit', 'customs', 'delivered'], default: 'loading' },
  salesOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'SalesOrder' },
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);
