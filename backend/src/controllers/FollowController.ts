import { Response } from 'express';
import { FollowService } from '../services/FollowService';
import { AuthRequest } from '../middleware/auth';

const followService = new FollowService();

export class FollowController {
  async toggleFollow(req: AuthRequest, res: Response) {
    try {
      const followerId = req.user?.userId;
      if (!followerId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id: followingId } = req.params;
      const result = await followService.toggleFollow(followerId, followingId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getFollowList(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const type = req.query.type as 'followers' | 'following';
      if (type !== 'followers' && type !== 'following') {
        res.status(400).json({ error: 'Query parameter type harus followers atau following!' });
        return;
      }

      const list = await followService.getFollowList(userId, type);
      res.status(200).json(list);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
export const followController = new FollowController();
