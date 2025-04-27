const Cart = require('../models/cart');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.getCartByUserId = async (userId) => {
  return await Cart.findOne({ userId }).populate('items.product');
};

exports.addToCart = async (userId, productId, quantity) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = new Cart({ userId, items: [] });
  const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  return cart;
};

exports.removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return null;
  cart.items = cart.items.filter(item => !item.product.equals(productId));
  await cart.save();
  return cart;
};

exports.clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return null;
  cart.items = [];
  await cart.save();
  return cart;
};

exports.checkout = async (userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const cart = await Cart.findOne({ userId }).session(session);
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return { error: 'Cart is empty' };
    }
    // Check stock for each item
    for (const item of cart.items) {
      const product = await Product.findById(item.product).session(session);
      if (!product || product.stock < item.quantity) {
        await session.abortTransaction();
        return { error: `Insufficient stock for product ${item.product}` };
      }
    }
    // Deduct stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }
    cart.items = [];
    await cart.save({ session });
    await session.commitTransaction();
    return { message: 'Checkout successful' };
  } catch (err) {
    await session.abortTransaction();
    console.error('Transaction aborted due to error:', err);
    throw err;
  } finally {
    session.endSession();
  }
};