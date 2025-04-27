# shopping-cart-api

This is a shopping cart system API where multiple users can purchase products from a shared inventory. The system is designed for efficiency and scalability.

## Features

- Product inventory management with stock control
- User cart management (add, remove, clear, checkout)
- Prevents overselling with transactional checkout
- Redis caching for fast product reads
- Input validation and NoSQL injection protection
- Automated tests with Jest and Supertest
- Interactive API documentation with Swagger

## Setup Instructions

1. **Clone the repository**

2. **Install dependencies**
   ```
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` and set your MongoDB and Redis connection strings.

4. **Seed the database**
   ```
   node src/seed/seedData.js
   ```

5. **Start the server**
   ```
   npm run dev
   ```
   or
   ```
   node src/app.js
   ```

6. **Run automated tests**
   ```
   npm test
   ```

7. **Access API documentation**
   - Visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs) for Swagger UI.

## API Endpoints

- `GET /api/products` — List products
- `POST /api/products` — Create product
- `GET /api/products/:id` — Get product
- `PUT /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product
- `GET /api/carts/:userId` — Get user's cart
- `POST /api/carts/:userId/add` — Add item to cart
- `POST /api/carts/:userId/remove` — Remove item from cart
- `POST /api/carts/:userId/clear` — Clear cart
- `POST /api/carts/:userId/checkout` — Checkout

**Note:** All endpoints require valid input as described in the API.

## Example API Usage

### Add Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Monitor",
  "price": 250,
  "stock": 15
}
```

### Add Item to Cart
```http
POST /api/carts/user123/add
Content-Type: application/json

{
  "productId": "<PRODUCT_ID>",
  "quantity": 2
}
```

### Checkout Cart
```http
POST /api/carts/user123/checkout
```

### Notes
- Replace `<PRODUCT_ID>` with the actual product ID from your database.
- All endpoints require valid input as described above.
- For security, all input is validated and sanitized to prevent injection attacks.
- See [http://localhost:3000/api-docs](http://localhost:3000/api-docs) for full API documentation.