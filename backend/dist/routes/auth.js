"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/register:
 *   post:
 *     summary: Registrasi user baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Berhasil registrasi
 *       400:
 *         description: Kesalahan validasi
 */
router.post('/register', (req, res) => AuthController_1.authController.register(req, res));
/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Berhasil login, mengembalikan token JWT
 *       400:
 *         description: Email/Password salah
 */
router.post('/login', (req, res) => AuthController_1.authController.login(req, res));
/**
 * @openapi
 * /api/profile:
 *   get:
 *     summary: Mendapatkan profil user yang sedang login
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data profil user
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', auth_1.authenticateToken, (req, res) => AuthController_1.authController.getProfile(req, res));
/**
 * @openapi
 * /api/profile/update:
 *   put:
 *     summary: Memperbarui profil user (fullName, bio, avatar)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 *       401:
 *         description: Unauthorized
 */
router.put('/profile/update', auth_1.authenticateToken, upload_1.upload.single('avatar'), (req, res) => AuthController_1.authController.updateProfile(req, res));
/**
 * @openapi
 * /api/users/search:
 *   get:
 *     summary: Mencari user berdasarkan username atau nama lengkap
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daftar user yang cocok
 */
router.get('/users/search', (req, res) => AuthController_1.authController.search(req, res));
exports.default = router;
