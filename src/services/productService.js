const Product = require('../models/product');

exports.createProduct = async (data) => {
  return await Product.create(data);
};

exports.getProducts = async () => {
  return await Product.find().lean();
};

exports.getProductById = async (id) => {
  return await Product.findById(id).lean();
};

exports.updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};