"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class ThreadRepository {
    async create(data) {
        return prisma_1.default.thread.create({
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
    async findAll(currentUserId) {
        const threads = await prisma_1.default.thread.findMany({
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
    async findById(id, currentUserId) {
        const thread = await prisma_1.default.thread.findUnique({
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
        if (!thread)
            return null;
        const isLiked = currentUserId
            ? thread.likes.some((like) => like.userId === currentUserId)
            : false;
        const { likes, ...threadData } = thread;
        return {
            ...threadData,
            isLiked,
        };
    }
    async findByUserId(userId, currentUserId) {
        const threads = await prisma_1.default.thread.findMany({
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
    async createReply(data) {
        return prisma_1.default.reply.create({
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
    async findLike(userId, threadId) {
        return prisma_1.default.like.findUnique({
            where: {
                userId_threadId: { userId, threadId },
            },
        });
    }
    async addLike(userId, threadId) {
        return prisma_1.default.like.create({
            data: { userId, threadId },
        });
    }
    async removeLike(userId, threadId) {
        return prisma_1.default.like.delete({
            where: {
                userId_threadId: { userId, threadId },
            },
        });
    }
}
exports.ThreadRepository = ThreadRepository;
