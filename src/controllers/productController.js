const productService = require('../services/productService');
const cache = require('../utils/cache');

exports.createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    await cache.clearCache('products');
    res.status(201).json(product);
  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return res.status(400).json({ error: 'Product already exists' });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await cache.getOrSetCache('products', productService.getProducts);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await cache.getOrSetCache(
      `product:${req.params.id}`,
      () => productService.getProductById(req.params.id)
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await cache.clearCache('products');
    await cache.clearCache(`product:${req.params.id}`);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await cache.clearCache('products');
    await cache.clearCache(`product:${req.params.id}`);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};