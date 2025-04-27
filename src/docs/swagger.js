const swaggerJSDoc = require('swagger-jsdoc');

const serverUrl = process.env.SWAGGER_SERVER_URL || 'http://localhost:3000';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shopping Cart API',
      version: '1.0.0',
      description: 'API documentation for the Shopping Cart system',
    },
    servers: [
      { url: serverUrl }
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;