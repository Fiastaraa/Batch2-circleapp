import { Server as SocketServer } from 'socket.io';

let io: SocketServer | null = null;

export const initSocket = (server: any) => {
  io = new SocketServer(server, {
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

// Fungsi helper untuk broadcast thread baru
export const broadcastNewThread = (thread: any) => {
  if (io) {
    console.log('[WebSocket Broadcast] Mengirim notifikasi thread baru ke semua client.');
    io.emit('threadCreated', thread);
  } else {
    console.log('[WebSocket Warning] IO server belum diinisialisasi.');
  }
};

export const broadcastNewReply = (reply: any) => {
  if (io) {
    console.log('[WebSocket Broadcast] Mengirim notifikasi reply baru ke semua client.');
    io.emit('replyCreated', reply);
  } else {
    console.log('[WebSocket Warning] IO server belum diinisialisasi.');
  }
};
