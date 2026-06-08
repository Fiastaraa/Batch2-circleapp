import { EventEmitter } from 'events';

// EventEmitter untuk memproses job di background (In-Memory Queue)
class ImageQueue extends EventEmitter {
  private queue: Array<{ id: string; imagePath: string; userId: string }> = [];
  private isProcessing = false;

  constructor() {
    super();
    this.on('new-job', this.processNext);
  }

  // Push job ke dalam queue
  public addJob(imagePath: string, userId: string) {
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
  private async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const currentJob = this.queue.shift()!;
    console.log(`[Queue Process] Memulai pemrosesan Job #${currentJob.id} untuk file: ${currentJob.imagePath}`);

    // Simulasi pemrosesan gambar (misalnya optimasi ukuran file)
    setTimeout(() => {
      console.log(`[Queue Done] Job #${currentJob.id} Selesai! File ${currentJob.imagePath} berhasil dioptimasi.`);
      this.isProcessing = false;
      this.processNext(); // Lanjut ke job berikutnya
    }, 3000); // 3 detik pemrosesan
  }
}

export const imageQueue = new ImageQueue();
