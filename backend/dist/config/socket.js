"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastNewThread = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io = null;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*', // Izinkan frontend mengakses
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log(`🔌 WebSocket Client Terkoneksi: ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`🔌 WebSocket Client Terputus: ${socket.id}`);
        });
    });
    return io;
};
exports.initSocket = initSocket;
// Fungsi helper untuk broadcast thread baru
const broadcastNewThread = (thread) => {
    if (io) {
        console.log('[WebSocket Broadcast] Mengirim notifikasi thread baru ke semua client.');
        io.emit('threadCreated', thread);
    }
    else {
        console.log('[WebSocket Warning] IO server belum diinisialisasi.');
    }
};
exports.broadcastNewThread = broadcastNewThread;
