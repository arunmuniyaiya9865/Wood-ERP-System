const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  logId: { type: String, required: true, unique: true },
  species: { type: String, enum: ['Pine', 'Oak', 'Teak', 'Mahogany', 'Spruce', 'Merbau', 'Acacia', 'Other'], required: true },
  grade: { type: String, enum: ['A+', 'A', 'B+', 'B', 'C'], required: true },
  diameter: { type: Number, required: true },
  length: { type: Number, required: true },
  volume: { type: Number, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['available', 'in_processing', 'processed'], default: 'available' },
  receivedDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
