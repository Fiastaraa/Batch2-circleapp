"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class FollowRepository {
    async findFollow(followerId, followingId) {
        return prisma_1.default.following.findUnique({
            where: {
                followerId_followingId: { followerId, followingId },
            },
        });
    }
    async follow(followerId, followingId) {
        return prisma_1.default.following.create({
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
    async unfollow(followerId, followingId) {
        return prisma_1.default.following.delete({
            where: {
                followerId_followingId: { followerId, followingId },
            },
        });
    }
    // Mendapatkan daftar user yang di-follow oleh userId (Following)
    async getFollowing(userId) {
        const follows = await prisma_1.default.following.findMany({
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
    async getFollowers(userId) {
        const follows = await prisma_1.default.following.findMany({
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
exports.FollowRepository = FollowRepository;
