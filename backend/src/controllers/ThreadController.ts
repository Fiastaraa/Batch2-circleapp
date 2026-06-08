import { Response } from 'express';
import { ThreadService } from '../services/ThreadService';
import { AuthRequest } from '../middleware/auth';

const threadService = new ThreadService();

export class ThreadController {
  async getFeed(req: AuthRequest, res: Response) {
    try {
      const currentUserId = req.user?.userId;
      const feed = await threadService.getFeed(currentUserId);
      res.status(200).json(feed);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createThread(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { content } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      const newThread = await threadService.createThread(userId, content, image);
      res.status(201).json({
        message: 'Thread berhasil dibuat!',
        thread: newThread,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getThreadDetail(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const currentUserId = req.user?.userId;
      const thread = await threadService.getThreadById(id, currentUserId);
      res.status(200).json(thread);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async createReply(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id: threadId } = req.params;
      const { content } = req.body;

      const reply = await threadService.createReply(userId, threadId, content);
      res.status(201).json({
        message: 'Balasan berhasil dikirim!',
        reply,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async toggleLike(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id: threadId } = req.params;
      const result = await threadService.toggleLike(userId, threadId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMyThreads(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const result = await threadService.getMyThreads(userId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
export const threadController = new ThreadController();
