import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';

const userRepository = new UserRepository();

export class AuthService {
  async register(data: any) {
    const { username, email, password, fullName } = data;

    // Check if fields are present
    if (!username || !email || !password || !fullName) {
      throw new Error('Semua kolom harus diisi!');
    }

    // Check if email or username is already taken
    const checkEmail = await userRepository.findByEmail(email);
    if (checkEmail) {
      throw new Error('Email sudah terdaftar!');
    }

    const checkUsername = await userRepository.findByUsername(username);
    if (checkUsername) {
      throw new Error('Username sudah digunakan!');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = await userRepository.create({
      username,
      email,
      password: hashedPassword,
      fullName,
    });

    // Omit password from output
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(data: any) {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error('Email dan password wajib diisi!');
    }

    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email atau password salah!');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Email atau password salah!');
    }

    // Generate token JWT
    const secret = process.env.JWT_SECRET || 'kunci_rahasia_bebas_kamu_di_sini_123';
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      secret,
      { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return {
      token,
      user: userWithoutPassword,
    };
  }

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User tidak ditemukan!');
    }
    return user;
  }

  async searchUsers(query: string, excludeUserId?: string) {
    return userRepository.searchUsers(query, excludeUserId);
  }

  async updateProfile(userId: string, data: { fullName?: string; bio?: string; avatar?: string }) {
    return userRepository.updateProfile(userId, data);
  }

  async getUserProfile(targetUserId: string, currentUserId: string) {
    const targetUser = await userRepository.findById(targetUserId);
    if (!targetUser) {
      throw new Error('User tidak ditemukan!');
    }
    const isFollowing = await userRepository.isFollowing(currentUserId, targetUserId);
    return {
      ...targetUser,
      isFollowing,
    };
  }
}
