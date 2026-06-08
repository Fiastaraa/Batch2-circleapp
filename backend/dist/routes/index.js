"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const threads_1 = __importDefault(require("./threads"));
const users_1 = __importDefault(require("./users"));
const apiRouter = (0, express_1.Router)();
// Mount sub-routers
apiRouter.use(auth_1.default);
apiRouter.use(threads_1.default);
apiRouter.use(users_1.default);
exports.default = apiRouter;
