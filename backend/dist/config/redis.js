"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const redis_1 = require("redis");
let client = null;
const memoryCache = new Map();
let isFallback = true;
// Buat client Redis
client = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});
client.on('error', (err) => {
    if (isFallback)
        return; // Supaya tidak spam log jika sudah fallback
    console.log('⚠️ Redis client error, falling back to In-Memory cache:', err.message);
    isFallback = true;
});
client.on('connect', () => {
    console.log('🚀 Redis cache connected successfully!');
    isFallback = false;
});
// Jalankan koneksi secara async (non-blocking)
client.connect().catch((err) => {
    console.log('⚠️ Redis server offline. Using local in-memory cache for "My Threads" caching.');
    isFallback = true;
});
exports.cache = {
    get: async (key) => {
        if (!isFallback) {
            try {
                return await client.get(key);
            }
            catch (err) {
                console.error('Redis GET error:', err);
            }
        }
        // Fallback Memory Cache
        const cached = memoryCache.get(key);
        if (!cached)
            return null;
        if (cached.expiresAt && cached.expiresAt < Date.now()) {
            memoryCache.delete(key);
            return null;
        }
        console.log(`[Cache Hit - IN MEMORY] Key: ${key}`);
        return cached.value;
    },
    set: async (key, value, ttlSeconds) => {
        if (!isFallback) {
            try {
                if (ttlSeconds) {
                    await client.set(key, value, { EX: ttlSeconds });
                }
                else {
                    await client.set(key, value);
                }
                return;
            }
            catch (err) {
                console.error('Redis SET error:', err);
            }
        }
        // Fallback Memory Cache
        const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
        memoryCache.set(key, { value, expiresAt });
        console.log(`[Cache Set - IN MEMORY] Key: ${key}, TTL: ${ttlSeconds || 'indefinite'}`);
    },
    del: async (key) => {
        if (!isFallback) {
            try {
                await client.del(key);
                return;
            }
            catch (err) {
                console.error('Redis DEL error:', err);
            }
        }
        memoryCache.delete(key);
        console.log(`[Cache Del - IN MEMORY] Key: ${key}`);
    },
    isFallback: () => isFallback,
};
