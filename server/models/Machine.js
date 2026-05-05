const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  machineId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Band Saw', 'Circular Saw', 'Planer', 'Chipper', 'Edger'], required: true },
  status: { type: String, enum: ['active', 'idle', 'maintenance'], default: 'idle' },
  efficiency: { type: Number, min: 0, max: 100, default: 0 },
  currentLog: { type: mongoose.Schema.Types.ObjectId, ref: 'Log', default: null },
  operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Machine', machineSchema);
