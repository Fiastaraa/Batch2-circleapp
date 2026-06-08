import { Response } from 'express';
import { AuthService } from '../services/AuthService';
import { AuthRequest } from '../middleware/auth';

const authService = new AuthService();

export class AuthController {
  async register(req: AuthRequest, res: Response) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({
        message: 'Registrasi berhasil! Silakan login.',
        user,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: AuthRequest, res: Response) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        message: 'Login berhasil!',
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const profile = await authService.getProfile(userId);
      res.status(200).json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async search(req: AuthRequest, res: Response) {
    try {
      const query = req.query.query as string;
      if (!query) {
        res.status(200).json([]);
        return;
      }

      const users = await authService.searchUsers(query);
      res.status(200).json(users);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { fullName, bio } = req.body;
      const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

      const updateData: any = {};
      if (fullName) updateData.fullName = fullName;
      if (bio !== undefined) updateData.bio = bio;
      if (avatar) updateData.avatar = avatar;

      const updatedUser = await authService.updateProfile(userId, updateData);

      res.status(200).json({
        message: 'Profil berhasil diperbarui!',
        user: updatedUser,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
export const authController = new AuthController();
