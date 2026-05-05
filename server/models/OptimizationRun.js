const mongoose = require('mongoose');

const optimizationRunSchema = new mongoose.Schema({
  runId: { type: String, required: true, unique: true },
  log: { type: mongoose.Schema.Types.ObjectId, ref: 'Log', required: true },
  targetProduct: { type: String, required: true },
  yieldRate: { type: Number, required: true },
  patterns: { type: Number, required: true },
  wasteRate: { type: Number, required: true },
  valueSaved: { type: Number, required: true },
  runDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('OptimizationRun', optimizationRunSchema);
