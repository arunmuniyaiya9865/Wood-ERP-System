const mongoose = require('mongoose');

const salesOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  product: { type: String, required: true },
  volume: { type: Number, required: true },
  unit: { type: String, required: true },
  totalValue: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipping', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('SalesOrder', salesOrderSchema);
