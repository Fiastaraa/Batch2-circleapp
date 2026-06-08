"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadService = void 0;
const ThreadRepository_1 = require("../repositories/ThreadRepository");
const socket_1 = require("../config/socket");
const queue_1 = require("../config/queue");
const redis_1 = require("../config/redis");
const threadRepository = new ThreadRepository_1.ThreadRepository();
class ThreadService {
    async getFeed(currentUserId) {
        return threadRepository.findAll(currentUserId);
    }
    async getThreadById(id, currentUserId) {
        const thread = await threadRepository.findById(id, currentUserId);
        if (!thread) {
            throw new Error('Thread tidak ditemukan!');
        }
        return thread;
    }
    async createThread(userId, content, image) {
        if (!content && !image) {
            throw new Error('Konten thread atau gambar wajib diisi!');
        }
        const newThread = await threadRepository.create({
            content,
            image,
            userId,
        });
        // 1. WebSocket Broadcast: beri tahu semua client real-time
        (0, socket_1.broadcastNewThread)(newThread);
        // 2. Message Queue: jika ada gambar, masukkan ke background queue
        if (image) {
            queue_1.imageQueue.addJob(image, userId);
        }
        // Invalidate Cache "My Threads" milik user ini
        await redis_1.cache.del(`user-threads:${userId}`);
        return newThread;
    }
    async createReply(userId, threadId, content) {
        if (!content) {
            throw new Error('Konten komentar tidak boleh kosong!');
        }
        // Check if thread exists
        const thread = await threadRepository.findById(threadId);
        if (!thread) {
            throw new Error('Thread tidak ditemukan!');
        }
        return threadRepository.createReply({
            content,
            threadId,
            userId,
        });
    }
    async toggleLike(userId, threadId) {
        const thread = await threadRepository.findById(threadId);
        if (!thread) {
            throw new Error('Thread tidak ditemukan!');
        }
        const existingLike = await threadRepository.findLike(userId, threadId);
        if (existingLike) {
            // Unlike
            await threadRepository.removeLike(userId, threadId);
            return { liked: false, message: 'Unliked successfully' };
        }
        else {
            // Like
            await threadRepository.addLike(userId, threadId);
            return { liked: true, message: 'Liked successfully' };
        }
    }
    // === REDIS CACHING FOR MY THREADS (MY TWEETS) ===
    async getMyThreads(userId) {
        const cacheKey = `user-threads:${userId}`;
        // 1. Cek di Redis cache
        const cachedData = await redis_1.cache.get(cacheKey);
        if (cachedData) {
            console.log(`[Redis Caching] Hit cache untuk key ${cacheKey}`);
            return {
                source: 'cache',
                data: JSON.parse(cachedData),
            };
        }
        // 2. Jika tidak ada di cache, ambil dari database
        console.log(`[Redis Caching] Miss cache untuk key ${cacheKey}. Ambil dari Database PostgreSQL...`);
        const threads = await threadRepository.findByUserId(userId, userId);
        // 3. Simpan hasil ke Redis cache (expired dalam 60 detik)
        await redis_1.cache.set(cacheKey, JSON.stringify(threads), 60);
        return {
            source: 'database',
            data: threads,
        };
    }
}
exports.ThreadService = ThreadService;
