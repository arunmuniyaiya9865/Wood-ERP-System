const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  poId: { type: String, required: true, unique: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  species: { type: String, required: true },
  volume: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'shipped', 'completed', 'cancelled'], default: 'pending' },
  expectedDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
