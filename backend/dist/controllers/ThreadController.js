"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.threadController = exports.ThreadController = void 0;
const ThreadService_1 = require("../services/ThreadService");
const threadService = new ThreadService_1.ThreadService();
class ThreadController {
    async getFeed(req, res) {
        try {
            const currentUserId = req.user?.userId;
            const feed = await threadService.getFeed(currentUserId);
            res.status(200).json(feed);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createThread(req, res) {
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
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getThreadDetail(req, res) {
        try {
            const { id } = req.params;
            const currentUserId = req.user?.userId;
            const thread = await threadService.getThreadById(id, currentUserId);
            res.status(200).json(thread);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async createReply(req, res) {
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
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async toggleLike(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id: threadId } = req.params;
            const result = await threadService.toggleLike(userId, threadId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getMyThreads(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const result = await threadService.getMyThreads(userId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.ThreadController = ThreadController;
exports.threadController = new ThreadController();
