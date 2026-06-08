"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const FollowRepository_1 = require("../repositories/FollowRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const followRepository = new FollowRepository_1.FollowRepository();
const userRepository = new UserRepository_1.UserRepository();
class FollowService {
    async toggleFollow(followerId, followingId) {
        if (followerId === followingId) {
            throw new Error('Anda tidak bisa memfollow diri sendiri!');
        }
        const targetUser = await userRepository.findById(followingId);
        if (!targetUser) {
            throw new Error('User yang dituju tidak ditemukan!');
        }
        const existingFollow = await followRepository.findFollow(followerId, followingId);
        if (existingFollow) {
            // Unfollow
            await followRepository.unfollow(followerId, followingId);
            return { followed: false, message: `Berhasil unfollow @${targetUser.username}` };
        }
        else {
            // Follow
            await followRepository.follow(followerId, followingId);
            return { followed: true, message: `Berhasil follow @${targetUser.username}` };
        }
    }
    async getFollowList(userId, type) {
        if (type === 'followers') {
            return followRepository.getFollowers(userId);
        }
        else {
            return followRepository.getFollowing(userId);
        }
    }
}
exports.FollowService = FollowService;
