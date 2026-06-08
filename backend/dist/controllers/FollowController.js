"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followController = exports.FollowController = void 0;
const FollowService_1 = require("../services/FollowService");
const followService = new FollowService_1.FollowService();
class FollowController {
    async toggleFollow(req, res) {
        try {
            const followerId = req.user?.userId;
            if (!followerId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id: followingId } = req.params;
            const result = await followService.toggleFollow(followerId, followingId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getFollowList(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const type = req.query.type;
            if (type !== 'followers' && type !== 'following') {
                res.status(400).json({ error: 'Query parameter type harus followers atau following!' });
                return;
            }
            const list = await followService.getFollowList(userId, type);
            res.status(200).json(list);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.FollowController = FollowController;
exports.followController = new FollowController();
