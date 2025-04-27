require('dotenv').config({ path: require('path').resolve(__dirname, '../config/.env') });
const mongoose = require('mongoose');
const Product = require('../models/product');

const products = [
  { name: 'Laptop', price: 1200, stock: 10 },
  { name: 'Headphones', price: 150, stock: 30 },
  { name: 'Keyboard', price: 80, stock: 20 },
  { name: 'Mouse', price: 40, stock: 25 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Seed data inserted');
  await mongoose.disconnect();
}

seed();