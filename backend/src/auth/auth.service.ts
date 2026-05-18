// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

// ✅ PASTIKAN import User entity dari path yang benar
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  // ✅ VALIDATE USER: Untuk login
  async validateUser(email: string, password: string): Promise<any> {
    // Note: password has select: false, so we add it explicitly
    const user = await this.userRepository.findOne({
      where: { email },
      select: ["id", "email", "name", "role", "password", "isActive", "createdAt", "updatedAt"],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isActive) {
        throw new UnauthorizedException("Account is deactivated");
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // ✅ LOGIN: Generate JWT token
  async login(user: any) {
    // ✅ PASTIKAN field 'role' disertakan di payload JWT untuk RBAC
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role, // ← ← ← WAJIB ADA untuk RolesGuard
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role, // ← ← ← Juga kirim di response frontend
        name: user.name,
        isActive: user.isActive,
      },
    };
  }

  // ✅ REGISTER: Tambahkan method ini (dipanggil AuthController)
  async register(registerDto: { email: string; password: string; name?: string; role?: string }) {
    // Check if email already exists
    const existing = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create new user with defaults
    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name || "",
      role: registerDto.role || "user", // Default to 'user' for security
      isActive: true,
    });

    const saved = await this.userRepository.save(user);

    // Return without password
    const { password, ...result } = saved;
    return result;
  }

  // ✅ GET PROFILE: Tambahkan method ini (dipanggil AuthController)
  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ["id", "email", "name", "role", "isActive", "createdAt", "updatedAt"],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }
}
