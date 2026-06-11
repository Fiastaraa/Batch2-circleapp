import { Router } from 'express';
import { threadController } from '../controllers/ThreadController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

/**
 * @openapi
 * /api/threads:
 *   get:
 *     summary: Mendapatkan timeline semua thread
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar thread
 */
router.get('/threads', authenticateToken as any, (req, res) => threadController.getFeed(req, res));

/**
 * @openapi
 * /api/threads:
 *   post:
 *     summary: Membuat thread baru (dengan opsional gambar)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Thread berhasil dibuat
 *       401:
 *         description: Unauthorized
 */
router.post('/threads', authenticateToken as any, upload.single('image'), (req, res) => threadController.createThread(req, res));

/**
 * @openapi
 * /api/threads/my:
 *   get:
 *     summary: Mendapatkan list thread milik sendiri (menggunakan Caching Redis)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar thread milik user dengan status hit/miss cache
 */
router.get('/threads/my', authenticateToken as any, (req, res) => threadController.getMyThreads(req, res));

/**
 * @openapi
 * /api/threads/{id}:
 *   get:
 *     summary: Mendapatkan detail thread beserta replies
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
 *         description: Detail thread
 *       404:
 *         description: Thread tidak ditemukan
 */
router.get('/threads/:id', authenticateToken as any, (req, res) => threadController.getThreadDetail(req, res));

/**
 * @openapi
 * /api/threads/{id}/reply:
 *   post:
 *     summary: Membalas thread
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Balasan berhasil disimpan
 *       401:
 *         description: Unauthorized
 */
router.post('/threads/:id/reply', authenticateToken as any, upload.single('image'), (req, res) => threadController.createReply(req, res));

/**
 * @openapi
 * /api/threads/{id}/like:
 *   post:
 *     summary: Menyukai atau membatalkan suka pada thread (Toggle Like)
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
 *         description: Status toggle like
 *       401:
 *         description: Unauthorized
 */
router.post('/threads/:id/like', authenticateToken as any, (req, res) => threadController.toggleLike(req, res));

export default router;
