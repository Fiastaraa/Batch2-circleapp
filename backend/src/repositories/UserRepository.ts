import prisma from '../config/prisma';

export class UserRepository {
  async create(data: any) {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        bio: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });
  }

  async searchUsers(query: string, excludeUserId?: string) {
    const whereClause: any = {};
    if (query) {
      whereClause.OR = [
        { username: { contains: query, mode: 'insensitive' } },
        { fullName: { contains: query, mode: 'insensitive' } },
      ];
    }
    if (excludeUserId) {
      whereClause.id = { not: excludeUserId };
    }
    return prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        fullName: true,
        avatar: true,
        bio: true,
      },
      take: 10,
    });
  }

  async updateProfile(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        bio: true,
        avatar: true,
      },
    });
  }

  async isFollowing(followerId: string, followingId: string) {
    const record = await prisma.following.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
    return !!record;
  }
}
