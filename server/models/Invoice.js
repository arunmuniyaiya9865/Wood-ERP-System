const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  salesOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'SalesOrder', required: true },
  amount: { type: Number, required: true },
  issuedDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  status: { type: String, enum: ['open', 'paid', 'overdue', 'cancelled'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
