import { ThreadRepository } from '../repositories/ThreadRepository';
import { broadcastNewThread, broadcastNewReply } from '../config/socket';
import { imageQueue } from '../config/queue';
import { cache } from '../config/redis';

const threadRepository = new ThreadRepository();

export class ThreadService {
  async getFeed(currentUserId?: string) {
    return threadRepository.findAll(currentUserId);
  }

  async getThreadById(id: string, currentUserId?: string) {
    const thread = await threadRepository.findById(id, currentUserId);
    if (!thread) {
      throw new Error('Thread tidak ditemukan!');
    }
    return thread;
  }

  async createThread(userId: string, content: string, image?: string | null) {
    if (!content && !image) {
      throw new Error('Konten thread atau gambar wajib diisi!');
    }

    const newThread = await threadRepository.create({
      content: content || '',
      image,
      userId,
    });

    // 1. WebSocket Broadcast: beri tahu semua client real-time
    broadcastNewThread(newThread);

    // 2. Message Queue: jika ada gambar, masukkan ke background queue
    if (image) {
      imageQueue.addJob(image, userId);
    }

    // Invalidate Cache "My Threads" milik user ini
    await cache.del(`user-threads:${userId}`);

    return newThread;
  }

  async createReply(userId: string, threadId: string, content: string, image?: string | null) {
    if (!content && !image) {
      throw new Error('Konten komentar atau gambar wajib diisi!');
    }

    // Check if thread exists
    const thread = await threadRepository.findById(threadId);
    if (!thread) {
      throw new Error('Thread tidak ditemukan!');
    }

    const reply = await threadRepository.createReply({
      content,
      image,
      threadId,
      userId,
    });

    // WebSocket Broadcast: beri tahu semua client real-time
    broadcastNewReply(reply);

    // Message Queue: jika ada gambar, masukkan ke background queue
    if (image) {
      imageQueue.addJob(image, userId);
    }

    // Invalidate Cache "My Threads"
    await cache.del(`user-threads:${thread.userId}`);
    await cache.del(`user-threads:${userId}`);

    return reply;
  }

  async toggleLike(userId: string, threadId: string) {
    const thread = await threadRepository.findById(threadId);
    if (!thread) {
      throw new Error('Thread tidak ditemukan!');
    }

    const existingLike = await threadRepository.findLike(userId, threadId);

    if (existingLike) {
      // Unlike
      await threadRepository.removeLike(userId, threadId);
      await cache.del(`user-threads:${thread.userId}`);
      await cache.del(`user-threads:${userId}`);
      return { liked: false, message: 'Unliked successfully' };
    } else {
      // Like
      await threadRepository.addLike(userId, threadId);
      await cache.del(`user-threads:${thread.userId}`);
      await cache.del(`user-threads:${userId}`);
      return { liked: true, message: 'Liked successfully' };
    }
  }

  // === REDIS CACHING FOR MY THREADS (MY TWEETS) ===
  async getMyThreads(userId: string) {
    const cacheKey = `user-threads:${userId}`;

    // 1. Cek di Redis cache
    const cachedData = await cache.get(cacheKey);
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
    await cache.set(cacheKey, JSON.stringify(threads), 60);

    return {
      source: 'database',
      data: threads,
    };
  }

  async updateThread(userId: string, threadId: string, content: string) {
    const thread = await threadRepository.findById(threadId);
    if (!thread) {
      throw new Error('Thread tidak ditemukan!');
    }
    if (thread.userId !== userId) {
      throw new Error('Anda tidak memiliki akses untuk mengedit thread ini!');
    }
    if (!content) {
      throw new Error('Konten thread wajib diisi!');
    }
    const updated = await threadRepository.update(threadId, content);
    
    // Invalidate Cache
    await cache.del(`user-threads:${userId}`);
    
    return updated;
  }

  async deleteThread(userId: string, threadId: string) {
    const thread = await threadRepository.findById(threadId);
    if (!thread) {
      throw new Error('Thread tidak ditemukan!');
    }
    if (thread.userId !== userId) {
      throw new Error('Anda tidak memiliki akses untuk menghapus thread ini!');
    }
    await threadRepository.delete(threadId);
    
    // Invalidate Cache
    await cache.del(`user-threads:${userId}`);
    
    return { message: 'Thread berhasil dihapus!' };
  }

  async getUserThreads(targetUserId: string, currentUserId?: string) {
    return threadRepository.findByUserId(targetUserId, currentUserId);
  }
}
