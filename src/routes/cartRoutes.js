const express = require('express');
const { body, param, validationResult } = require('express-validator');
const cartController = require('../controllers/cartController');
const router = express.Router();

/**
 * @swagger
 * /api/carts/{userId}:
 *   get:
 *     summary: Get a user's cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User's cart
 *
 * /api/carts/{userId}/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to cart
 *
 * /api/carts/{userId}/add-multiple:
 *   post:
 *     summary: Add multiple items to cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Items added to cart
 * 
 * /api/carts/{userId}/remove:
 *   post:
 *     summary: Remove item from cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 *
 * /api/carts/{userId}/clear:
 *   post:
 *     summary: Clear user's cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Cart cleared
 *
 * /api/carts/{userId}/checkout:
 *   post:
 *     summary: Checkout user's cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Checkout successful
 *       400:
 *         description: Insufficient stock or cart empty
 *
 */

// Validation middleware
const validateUserId = [
  param('userId').isString().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateAddToCart = [
  body('productId').isMongoId(),
  body('quantity').isInt({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateRemoveFromCart = [
  body('productId').isMongoId(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateAddMultipleToCart = [
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isMongoId(),
  body('items.*.quantity').isInt({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// All routes use :userId as a path parameter
router.get('/:userId', validateUserId, cartController.getCart);
router.post('/:userId/add', validateUserId.concat(validateAddToCart), cartController.addToCart);
router.post('/:userId/add-multiple', validateUserId.concat(validateAddMultipleToCart), cartController.addMultipleToCart);
router.post('/:userId/remove', validateUserId.concat(validateRemoveFromCart), cartController.removeFromCart);
router.post('/:userId/clear', validateUserId, cartController.clearCart);
router.post('/:userId/checkout', validateUserId, cartController.checkout);

module.exports = router;