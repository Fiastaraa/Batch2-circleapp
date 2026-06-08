import express from "express";
import cors from "cors";

const app = express();
const PORT = 7001;

// =============================================
// MIDDLEWARE — fungsi yang jalan SEBELUM request masuk
// =============================================
app.use(cors());            // izinkan frontend akses API kita
app.use(express.json());    // supaya bisa baca JSON dari body request

// =============================================
// DATA SEMENTARA (nanti diganti pakai database)
// =============================================
interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
}

interface Thread {
  id: number;
  content: string;
  image: string | null;
  created_by: number;
}

let users: User[] = [
  { id: 1, username: "fia_fiastara", full_name: "Fia Fiastara", email: "fia@email.com" },
  { id: 2, username: "budi_dev", full_name: "Budi Santoso", email: "budi@email.com" },
  { id: 3, username: "siti_code", full_name: "Siti Rahma", email: "siti@email.com" },
];

let threads: Thread[] = [
  { id: 1, content: "Hari pertama belajar TypeScript! 🎉", image: null, created_by: 1 },
  { id: 2, content: "Prisma ORM bikin query jadi gampang 💪", image: null, created_by: 2 },
  { id: 3, content: "React hooks bikin hidup lebih mudah ✨", image: null, created_by: 3 },
];

// =============================================
// ROUTES — endpoint API kita
// =============================================

// 🏠 Halaman utama
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Selamat datang di Threads API!",
    creator: "Fia Fiastara",
    endpoints: {
      users: "/api/users",
      threads: "/api/threads",
    },
  });
});

// =============================================
// 👤 USER ROUTES
// =============================================

// GET semua users
app.get("/api/users", (req, res) => {
  res.json({
    success: true,
    data: users,
    message: `Berhasil ambil ${users.length} users`,
  });
});

// GET user by ID
app.get("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: `User dengan id ${id} tidak ditemukan`,
    });
    return;
  }

  res.json({
    success: true,
    data: user,
  });
});

// POST buat user baru
app.post("/api/users", (req, res) => {
  const { username, full_name, email } = req.body;

  // Validasi sederhana
  if (!username || !full_name || !email) {
    res.status(400).json({
      success: false,
      message: "username, full_name, dan email wajib diisi!",
    });
    return;
  }

  const newUser: User = {
    id: users.length + 1,
    username,
    full_name,
    email,
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    data: newUser,
    message: "User berhasil ditambahkan!",
  });
});

// =============================================
// 📝 THREAD ROUTES
// =============================================

// GET semua threads
app.get("/api/threads", (req, res) => {
  res.json({
    success: true,
    data: threads,
    message: `Berhasil ambil ${threads.length} threads`,
  });
});

// GET thread by ID
app.get("/api/threads/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const thread = threads.find((t) => t.id === id);

  if (!thread) {
    res.status(404).json({
      success: false,
      message: `Thread dengan id ${id} tidak ditemukan`,
    });
    return;
  }

  res.json({
    success: true,
    data: thread,
  });
});

// POST buat thread baru
app.post("/api/threads", (req, res) => {
  const { content, image, created_by } = req.body;

  if (!content || !created_by) {
    res.status(400).json({
      success: false,
      message: "content dan created_by wajib diisi!",
    });
    return;
  }

  const newThread: Thread = {
    id: threads.length + 1,
    content,
    image: image || null,
    created_by,
  };

  threads.push(newThread);

  res.status(201).json({
    success: true,
    data: newThread,
    message: "Thread berhasil dibuat!",
  });
});

// DELETE thread
app.delete("/api/threads/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = threads.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({
      success: false,
      message: `Thread dengan id ${id} tidak ditemukan`,
    });
    return;
  }

  const deleted = threads.splice(index, 1);

  res.json({
    success: true,
    data: deleted[0],
    message: "Thread berhasil dihapus!",
  });
});

// =============================================
// 🚀 START SERVER
// =============================================
app.listen(PORT, () => {
  console.log(`
  ==========================================
  🚀 Server berjalan di http://localhost:${PORT}
  ==========================================
  Endpoints:
    GET    /api/users
    GET    /api/users/:id
    POST   /api/users

    GET    /api/threads
    GET    /api/threads/:id
    POST   /api/threads
    DELETE /api/threads/:id
  ==========================================
  `);
});
