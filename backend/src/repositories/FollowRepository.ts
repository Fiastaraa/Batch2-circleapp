import prisma from '../config/prisma';

export class FollowRepository {
  async findFollow(followerId: string, followingId: string) {
    return prisma.following.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
  }

  async follow(followerId: string, followingId: string) {
    return prisma.following.create({
      data: { followerId, followingId },
      include: {
        following: {
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

  async unfollow(followerId: string, followingId: string) {
    return prisma.following.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
  }

  // Mendapatkan daftar user yang di-follow oleh userId (Following)
  async getFollowing(userId: string) {
    const follows = await prisma.following.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return follows.map((f) => f.following);
  }

  // Mendapatkan daftar user yang mem-follow userId (Followers)
  async getFollowers(userId: string) {
    const follows = await prisma.following.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return follows.map((f) => f.follower);
  }
}
