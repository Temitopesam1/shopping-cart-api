const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Product = require('../src/models/product');

beforeAll(async () => {
  // Connect to test DB
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Product API', () => {
  let productId;

  it('should create a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Test Product', price: 99, stock: 10 });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Product');
    productId = res.body._id;
  });

  it('should get all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a product by id', async () => {
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(productId);
  });

  it('should update a product', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .send({ name: 'Updated', price: 100, stock: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated');
  });

  it('should delete a product', async () => {
    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Product deleted');
  });
});