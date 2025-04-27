const cartService = require('../services/cartService');

exports.getCart = async (req, res) => {
  try {
    const cart = await cartService.getCartByUserId(req.params.userId);
    if (!cart) return res.json({ userId: req.params.userId, items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(req.params.userId, productId, quantity);
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await cartService.removeFromCart(req.params.userId, productId);
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(req.params.userId);
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const result = await cartService.checkout(req.params.userId);
    if (result.error) return res.status(400).json({ error: result.error });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};