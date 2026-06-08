"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ThreadController_1 = require("../controllers/ThreadController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
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
router.get('/threads', auth_1.authenticateToken, (req, res) => ThreadController_1.threadController.getFeed(req, res));
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
router.post('/threads', auth_1.authenticateToken, upload_1.upload.single('image'), (req, res) => ThreadController_1.threadController.createThread(req, res));
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
router.get('/threads/my', auth_1.authenticateToken, (req, res) => ThreadController_1.threadController.getMyThreads(req, res));
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
router.get('/threads/:id', auth_1.authenticateToken, (req, res) => ThreadController_1.threadController.getThreadDetail(req, res));
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
router.post('/threads/:id/reply', auth_1.authenticateToken, (req, res) => ThreadController_1.threadController.createReply(req, res));
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
router.post('/threads/:id/like', auth_1.authenticateToken, (req, res) => ThreadController_1.threadController.toggleLike(req, res));
exports.default = router;
