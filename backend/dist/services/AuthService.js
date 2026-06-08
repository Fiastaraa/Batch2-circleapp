"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../repositories/UserRepository");
const userRepository = new UserRepository_1.UserRepository();
class AuthService {
    async register(data) {
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
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
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
    async login(data) {
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
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            throw new Error('Email atau password salah!');
        }
        // Generate token JWT
        const secret = process.env.JWT_SECRET || 'kunci_rahasia_bebas_kamu_di_sini_123';
        const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, secret, { expiresIn: '1d' });
        const { password: _, ...userWithoutPassword } = user;
        return {
            token,
            user: userWithoutPassword,
        };
    }
    async getProfile(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User tidak ditemukan!');
        }
        return user;
    }
    async searchUsers(query) {
        return userRepository.searchUsers(query);
    }
    async updateProfile(userId, data) {
        return userRepository.updateProfile(userId, data);
    }
}
exports.AuthService = AuthService;
