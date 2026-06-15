import prisma from '../config/prisma';

export class ThreadRepository {
  async create(data: { content: string; image?: string | null; userId: string }) {
    return prisma.thread.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    });
  }

  async findAll(currentUserId?: string) {
    const threads = await prisma.thread.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
        replies: {
          select: { id: true },
        },
        likes: {
          where: { userId: currentUserId || '' },
          select: { userId: true },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Petakan data agar sesuai format FE (menambahkan field isLiked)
    return threads.map((thread) => {
      const isLiked = currentUserId ? thread.likes.length > 0 : false;
      const { likes, ...threadData } = thread;
      return {
        ...threadData,
        isLiked,
      };
    });
  }

  async findById(id: string, currentUserId?: string) {
    const thread = await prisma.thread.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
        likes: {
          where: { userId: currentUserId || '' },
          select: { userId: true },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    });

    if (!thread) return null;

    const isLiked = currentUserId ? thread.likes.length > 0 : false;
    const { likes, ...threadData } = thread;
    return {
      ...threadData,
      isLiked,
    };
  }

  async findByUserId(userId: string, currentUserId?: string) {
    const threads = await prisma.thread.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
        likes: {
          where: { userId: currentUserId || '' },
          select: { userId: true },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return threads.map((thread) => {
      const isLiked = currentUserId ? thread.likes.length > 0 : false;
      const { likes, ...threadData } = thread;
      return {
        ...threadData,
        isLiked,
      };
    });
  }

  // === REPLIES ===
  async createReply(data: { content: string; image?: string | null; threadId: string; userId: string }) {
    return prisma.reply.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });
  }

  // === LIKES ===
  async findLike(userId: string, threadId: string) {
    return prisma.like.findUnique({
      where: {
        userId_threadId: { userId, threadId },
      },
    });
  }

  async addLike(userId: string, threadId: string) {
    return prisma.like.create({
      data: { userId, threadId },
    });
  }

  async removeLike(userId: string, threadId: string) {
    return prisma.like.delete({
      where: {
        userId_threadId: { userId, threadId },
      },
    });
  }

  async update(id: string, content: string) {
    return prisma.thread.update({
      where: { id },
      data: { content },
    });
  }

  async delete(id: string) {
    return prisma.thread.delete({
      where: { id },
    });
  }
}
