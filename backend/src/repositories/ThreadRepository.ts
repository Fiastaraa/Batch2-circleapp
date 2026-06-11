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

    // Petakan data agar sesuai format FE (menambahkan field isLiked)
    return threads.map((thread) => {
      const isLiked = currentUserId
        ? thread.likes.some((like) => like.userId === currentUserId)
        : false;
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

    const isLiked = currentUserId
      ? thread.likes.some((like) => like.userId === currentUserId)
      : false;
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
      const isLiked = currentUserId
        ? thread.likes.some((like) => like.userId === currentUserId)
        : false;
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
}
