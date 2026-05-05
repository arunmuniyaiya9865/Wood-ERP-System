const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  supplierId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  species: [{ type: String }],
  rating: { type: Number, min: 1, max: 5, default: 3 },
  totalOrders: { type: Number, default: 0 },
  ytdValue: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'active' },
  contactEmail: { type: String },
  contactPhone: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
