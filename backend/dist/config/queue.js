"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageQueue = void 0;
const events_1 = require("events");
// EventEmitter untuk memproses job di background (In-Memory Queue)
class ImageQueue extends events_1.EventEmitter {
    queue = [];
    isProcessing = false;
    constructor() {
        super();
        this.on('new-job', this.processNext);
    }
    // Push job ke dalam queue
    addJob(imagePath, userId) {
        const job = {
            id: Math.random().toString(36).substring(7),
            imagePath,
            userId,
        };
        this.queue.push(job);
        console.log(`[Queue Add] Job #${job.id} ditambahkan ke antrean image processing. (User: ${userId})`);
        this.emit('new-job');
    }
    // Ambil job berikutnya dan proses
    async processNext() {
        if (this.isProcessing || this.queue.length === 0)
            return;
        this.isProcessing = true;
        const currentJob = this.queue.shift();
        console.log(`[Queue Process] Memulai pemrosesan Job #${currentJob.id} untuk file: ${currentJob.imagePath}`);
        // Simulasi pemrosesan gambar (misalnya optimasi ukuran file)
        setTimeout(() => {
            console.log(`[Queue Done] Job #${currentJob.id} Selesai! File ${currentJob.imagePath} berhasil dioptimasi.`);
            this.isProcessing = false;
            this.processNext(); // Lanjut ke job berikutnya
        }, 3000); // 3 detik pemrosesan
    }
}
exports.imageQueue = new ImageQueue();
