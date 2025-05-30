const Redis = require('ioredis');
require('dotenv').config();

redis = new Redis(process.env.UPSTASH_REDIS_URL);
module.exports = redis;