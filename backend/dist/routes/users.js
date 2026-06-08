"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FollowController_1 = require("../controllers/FollowController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
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
router.post('/users/:id/follow', auth_1.authenticateToken, (req, res) => FollowController_1.followController.toggleFollow(req, res));
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
router.get('/users/follows', auth_1.authenticateToken, (req, res) => FollowController_1.followController.getFollowList(req, res));
exports.default = router;
