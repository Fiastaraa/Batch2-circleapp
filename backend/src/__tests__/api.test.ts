import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { app, server } from '../index';

// Close server after all tests to prevent open handle warnings
afterAll((done) => {
  if (server.listening) {
    server.close(done);
  } else {
    done();
  }
});

// ==========================================
// 1. UNIT TESTING
// ==========================================
describe('Unit Test: Hash password dan validasi token JWT', () => {
  it('Harus bisa melakukan hashing password dengan bcrypt', async () => {
    const rawPassword = 'rahasiah_kamu_123';
    const hash = await bcrypt.hash(rawPassword, 10);
    expect(hash).not.toBe(rawPassword);

    const isMatch = await bcrypt.compare(rawPassword, hash);
    expect(isMatch).toBe(true);
  });

  it('Harus bisa generate token JWT dan melakukan verifikasi token', () => {
    const payload = { userId: 'user-id-test-123', username: 'fia_fiastara' };
    const secret = 'kunci_rahasia_test';
    
    // Generate token
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    expect(token).toBeDefined();

    // Verify token
    const decoded = jwt.verify(token, secret) as typeof payload;
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.username).toBe(payload.username);
  });
});

// ==========================================
// 2. FUNCTIONAL TESTING
// ==========================================
describe('Functional Test: Validasi Input Validator', () => {
  const validateRegisterInput = (body: any) => {
    const { username, email, password, fullName } = body;
    if (!username || !email || !password || !fullName) {
      return { isValid: false, message: 'Semua kolom harus diisi!' };
    }
    if (password.length < 6) {
      return { isValid: false, message: 'Password minimal 6 karakter!' };
    }
    return { isValid: true };
  };

  it('Harus menolak register jika kolom kurang lengkap', () => {
    const res = validateRegisterInput({ username: 'fia' });
    expect(res.isValid).toBe(false);
    expect(res.message).toBe('Semua kolom harus diisi!');
  });

  it('Harus menolak register jika password kurang dari 6 karakter', () => {
    const res = validateRegisterInput({
      username: 'fia',
      email: 'fia@email.com',
      password: '123',
      fullName: 'Fia Fiastara',
    });
    expect(res.isValid).toBe(false);
    expect(res.message).toBe('Password minimal 6 karakter!');
  });

  it('Harus meloloskan register jika semua input valid', () => {
    const res = validateRegisterInput({
      username: 'fia',
      email: 'fia@email.com',
      password: 'mysecurepassword',
      fullName: 'Fia Fiastara',
    });
    expect(res.isValid).toBe(true);
  });
});

// ==========================================
// 3. INTEGRATION TESTING (API Endpoints)
// ==========================================
describe('Integration Test: API Endpoints menggunakan Supertest', () => {
  it('GET / -> Harus mengembalikan pesan sambutan (Sanity check)', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Welcome to Circle Threads Clone API');
  });

  it('POST /api/register -> Harus gagal registrasi jika request body kosong (400)', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
