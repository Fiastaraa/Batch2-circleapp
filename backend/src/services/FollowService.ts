import { FollowRepository } from '../repositories/FollowRepository';
import { UserRepository } from '../repositories/UserRepository';

const followRepository = new FollowRepository();
const userRepository = new UserRepository();

export class FollowService {
  async toggleFollow(followerId: string, followingId: string) {
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
    } else {
      // Follow
      await followRepository.follow(followerId, followingId);
      return { followed: true, message: `Berhasil follow @${targetUser.username}` };
    }
  }

  async getFollowList(userId: string, type: 'followers' | 'following') {
    if (type === 'followers') {
      return followRepository.getFollowers(userId);
    } else {
      return followRepository.getFollowing(userId);
    }
  }
}
