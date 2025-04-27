const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Product = require('../src/models/product');
const Cart = require('../src/models/cart');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await Product.deleteMany({});
  await Cart.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Cart API', () => {
  let productId;
  const userId = 'testuser';

  beforeAll(async () => {
    const product = await Product.create({ name: 'CartTest', price: 10, stock: 5 });
    productId = product._id;
  });

  it('should add item to cart', async () => {
    const res = await request(app)
      .post(`/api/carts/${userId}/add`)
      .send({ productId, quantity: 2 });
    expect(res.statusCode).toBe(200);
    expect(res.body.items[0].product).toBeDefined();
  });

  it('should get user cart', async () => {
    const res = await request(app).get(`/api/carts/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it('should checkout cart', async () => {
    const res = await request(app).post(`/api/carts/${userId}/checkout`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Checkout successful');
  });
});