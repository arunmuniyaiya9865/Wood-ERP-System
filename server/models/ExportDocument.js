const mongoose = require('mongoose');

const exportDocumentSchema = new mongoose.Schema({
  docId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Phytosanitary Certificate', 'Certificate of Origin', 'FSC Chain of Custody', 'Bill of Lading', 'Customs Declaration'], required: true },
  shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true },
  issuedDate: { type: Date },
  status: { type: String, enum: ['valid', 'pending', 'completed', 'expired'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('ExportDocument', exportDocumentSchema);
