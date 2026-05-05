const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  woId: { type: String, required: true, unique: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  species: { type: String, required: true },
  status: { type: String, enum: ['queued', 'in_progress', 'completed', 'cancelled'], default: 'queued' },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  team: { type: String },
  dueDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('WorkOrder', workOrderSchema);
