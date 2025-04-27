const redisClient = require('../config/redis');

exports.getOrSetCache = async (key, cb, ttl = 60) => {
  const cached = await redisClient.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  const freshData = await cb();
  await redisClient.setEx(key, ttl, JSON.stringify(freshData));
  return freshData;
};

exports.clearCache = async (key) => {
  await redisClient.del(key);
};