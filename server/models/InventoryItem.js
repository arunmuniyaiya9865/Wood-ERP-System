const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  unit: { type: String, enum: ['m²', 'm³', 'pcs'], required: true },
  inStock: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 },
  location: { type: String },
  unitValue: { type: Number, default: 0 },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

inventoryItemSchema.virtual('available').get(function () {
  return this.inStock - this.reserved;
});

inventoryItemSchema.virtual('totalValue').get(function () {
  return this.inStock * this.unitValue;
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
