"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const authService = new AuthService_1.AuthService();
class AuthController {
    async register(req, res) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json({
                message: 'Registrasi berhasil! Silakan login.',
                user,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async login(req, res) {
        try {
            const result = await authService.login(req.body);
            res.status(200).json({
                message: 'Login berhasil!',
                ...result,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getProfile(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const profile = await authService.getProfile(userId);
            res.status(200).json(profile);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async search(req, res) {
        try {
            const query = req.query.query;
            if (!query) {
                res.status(200).json([]);
                return;
            }
            const users = await authService.searchUsers(query);
            res.status(200).json(users);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { fullName, bio } = req.body;
            const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
            const updateData = {};
            if (fullName)
                updateData.fullName = fullName;
            if (bio !== undefined)
                updateData.bio = bio;
            if (avatar)
                updateData.avatar = avatar;
            const updatedUser = await authService.updateProfile(userId, updateData);
            res.status(200).json({
                message: 'Profil berhasil diperbarui!',
                user: updatedUser,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
