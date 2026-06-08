"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class UserRepository {
    async create(data) {
        return prisma_1.default.user.create({ data });
    }
    async findByEmail(email) {
        return prisma_1.default.user.findUnique({ where: { email } });
    }
    async findByUsername(username) {
        return prisma_1.default.user.findUnique({ where: { username } });
    }
    async findById(id) {
        return prisma_1.default.user.findUnique({
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
    async searchUsers(query) {
        return prisma_1.default.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: 'insensitive' } },
                    { fullName: { contains: query, mode: 'insensitive' } },
                ],
            },
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
    async updateProfile(id, data) {
        return prisma_1.default.user.update({
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
}
exports.UserRepository = UserRepository;
