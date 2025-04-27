const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Add unique: true
  price: { type: Number, required: true },
  stock: { type: Number, required: true }, // available quantity
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);