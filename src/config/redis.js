const redis = require('redis');

const client = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis connected successfully!'));
client.on('ready', () => console.log('Redis client is ready!'));

module.exports = client;

