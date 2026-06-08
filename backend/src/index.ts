import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import { initSocket } from './config/socket';
import { swaggerSpec } from './config/swagger';
import apiRouter from './routes';

// Load environment variables dari .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7001;

// Wrapper HTTP Server untuk WebSocket (Socket.io)
const server = http.createServer(app);

// Inisialisasi WebSocket
initSocket(server);

// ===== MIDDLEWARE SETUP =====
app.use(cors());
app.use(express.json());

// Expose static folder untuk folder uploads gambar
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Swagger API Docs Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route (Sanity check)
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '🚀 Welcome to Circle Threads Clone API!',
    docs: 'http://localhost:7001/api-docs',
    creator: 'Fia Fiastara',
  });
});

// ===== MOUNT API ROUTES =====
app.use('/api', apiRouter);

// Jalankan Server HTTP
server.listen(PORT, () => {
  console.log(`
  ==========================================
  🚀 Server berjalan di http://localhost:${PORT}
  📑 Dokumentasi API di http://localhost:${PORT}/api-docs
  ==========================================
  `);
});
export { app, server };
