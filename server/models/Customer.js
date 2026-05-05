const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  sector: { type: String, enum: ['Construction', 'Furniture', 'Trading', 'Interiors', 'Distribution', 'Manufacturing'], required: true },
  ytdRevenue: { type: Number, default: 0 },
  stage: { type: String, enum: ['prospect', 'qualified', 'proposal', 'negotiation', 'customer'], default: 'prospect' },
  assignedRep: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String },
  phone: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
