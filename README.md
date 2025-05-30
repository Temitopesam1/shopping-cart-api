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
   npm run start
   ```
   or
   ```
   npm run main
   ```

6. **Access API documentation**
   - Visit [https://shopping-cart-api-qb7x.onrender.com/api-docs](https://shopping-cart-api-qb7x.onrender.com/api-docs) for Swagger UI.

## API Endpoints

### Products

- `GET /api/products` — List products
- `POST /api/products` — Create product
- `GET /api/products/:id` — Get product
- `PUT /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product

### Cart

- `GET /api/carts/:userId` — Get user's cart
- `POST /api/carts/:userId/add` — Add item to cart
- `POST /api/carts/:userId/add-multiple` — Add multiple items to cart
- `POST /api/carts/:userId/remove` — Remove item from cart
- `POST /api/carts/:userId/clear` — Clear cart
- `POST /api/carts/:userId/checkout` — Checkout

## Assumptions

- Each product is uniquely identified by its `name`. Duplicate product names are not allowed.
- Users are identified by a unique `userId` string (no authentication implemented).
- Product stock is decremented only at checkout, not when items are added to the cart.
- If a product is out of stock at checkout, the checkout will fail and no stock will be deducted.
- Cart operations (add, remove, clear) do not validate product stock until checkout.
- All API requests are assumed to be trusted (authentication/authorization can be added as an enhancement).
- The API is stateless; all cart and product data is stored in MongoDB.
- Redis is used only for caching product reads, not for cart or transactional data.
- The system is designed for demonstration and interview purposes, not for production use.

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

### Add Multiple Items to Cart
```http
POST /api/carts/user123/add-multiple
Content-Type: application/json

{
  "items": [
    { "productId": "PRODUCT_ID_1", "quantity": 2 },
    { "productId": "PRODUCT_ID_2", "quantity": 1 }
  ]
}
```

### Checkout Cart
```http
POST /api/carts/user123/checkout
```

### Notes
- Replace `<PRODUCT_ID>` with the actual product ID from your database.
- Replace `PRODUCT_ID_1` and `PRODUCT_ID_2` with actual product IDs from your database.
- All endpoints require valid input as described above.
- For security, all input is validated and sanitized to prevent injection attacks.
- See [http://localhost:3000/api-docs](http://localhost:3000/api-docs) for full API documentation.