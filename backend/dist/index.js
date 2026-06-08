"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const socket_1 = require("./config/socket");
const swagger_1 = require("./config/swagger");
const routes_1 = __importDefault(require("./routes"));
// Load environment variables dari .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 7001;
// Wrapper HTTP Server untuk WebSocket (Socket.io)
const server = http_1.default.createServer(app);
exports.server = server;
// Inisialisasi WebSocket
(0, socket_1.initSocket)(server);
// ===== MIDDLEWARE SETUP =====
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Expose static folder untuk folder uploads gambar
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
// Swagger API Docs Route
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Root route (Sanity check)
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Welcome to Circle Threads Clone API!',
        docs: 'http://localhost:7001/api-docs',
        creator: 'Fia Fiastara',
    });
});
// ===== MOUNT API ROUTES =====
app.use('/api', routes_1.default);
// Jalankan Server HTTP
server.listen(PORT, () => {
    console.log(`
  ==========================================
  🚀 Server berjalan di http://localhost:${PORT}
  📑 Dokumentasi API di http://localhost:${PORT}/api-docs
  ==========================================
  `);
});
