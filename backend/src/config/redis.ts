import { createClient } from 'redis';

let client: any = null;
const memoryCache = new Map<string, { value: string; expiresAt: number | null }>();
let isFallback = true;

// Buat client Redis
client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err: any) => {
  if (isFallback) return; // Supaya tidak spam log jika sudah fallback
  console.log('⚠️ Redis client error, falling back to In-Memory cache:', err.message);
  isFallback = true;
});

client.on('connect', () => {
  console.log('🚀 Redis cache connected successfully!');
  isFallback = false;
});

// Jalankan koneksi secara async (non-blocking)
client.connect().catch((err: any) => {
  console.log('⚠️ Redis server offline. Using local in-memory cache for "My Threads" caching.');
  isFallback = true;
});

export const cache = {
  get: async (key: string): Promise<string | null> => {
    if (!isFallback) {
      try {
        return await client.get(key);
      } catch (err) {
        console.error('Redis GET error:', err);
      }
    }
    // Fallback Memory Cache
    const cached = memoryCache.get(key);
    if (!cached) return null;
    if (cached.expiresAt && cached.expiresAt < Date.now()) {
      memoryCache.delete(key);
      return null;
    }
    console.log(`[Cache Hit - IN MEMORY] Key: ${key}`);
    return cached.value;
  },

  set: async (key: string, value: string, ttlSeconds?: number): Promise<void> => {
    if (!isFallback) {
      try {
        if (ttlSeconds) {
          await client.set(key, value, { EX: ttlSeconds });
        } else {
          await client.set(key, value);
        }
        return;
      } catch (err) {
        console.error('Redis SET error:', err);
      }
    }
    // Fallback Memory Cache
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    memoryCache.set(key, { value, expiresAt });
    console.log(`[Cache Set - IN MEMORY] Key: ${key}, TTL: ${ttlSeconds || 'indefinite'}`);
  },

  del: async (key: string): Promise<void> => {
    if (!isFallback) {
      try {
        await client.del(key);
        return;
      } catch (err) {
        console.error('Redis DEL error:', err);
      }
    }
    memoryCache.delete(key);
    console.log(`[Cache Del - IN MEMORY] Key: ${key}`);
  },

  isFallback: () => isFallback,
};
