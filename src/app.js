require('dotenv').config({ path: require('path').resolve(__dirname, './config/.env') });
const express = require('express');
const connectDB = require('./config/db');
const redisClient = require('./config/redis');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();
app.use(express.json());



// Health check route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/api/carts', cartRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectDB();
        await redisClient.connect();
        app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();