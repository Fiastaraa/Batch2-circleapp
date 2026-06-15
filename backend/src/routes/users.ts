import { Router } from 'express';
import { followController } from '../controllers/FollowController';
import { authController } from '../controllers/AuthController';
import { threadController } from '../controllers/ThreadController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * /api/users/{id}/follow:
 *   post:
 *     summary: Memfollow atau unfollow user (Toggle Follow)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status toggle follow
 *       401:
 *         description: Unauthorized
 */
router.post('/users/:id/follow', authenticateToken as any, (req, res) => followController.toggleFollow(req, res));

/**
 * @openapi
 * /api/users/follows:
 *   get:
 *     summary: Mendapatkan daftar followers atau following
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [followers, following]
 *     responses:
 *       200:
 *         description: Daftar user followers/following
 *       401:
 *         description: Unauthorized
 */
router.get('/users/follows', authenticateToken as any, (req, res) => followController.getFollowList(req, res));

router.get('/users/:id', authenticateToken as any, (req, res) => authController.getUserProfile(req, res));
router.get('/users/:id/threads', authenticateToken as any, (req, res) => threadController.getUserThreads(req, res));

export default router;
