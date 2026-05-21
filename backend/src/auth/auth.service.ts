// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

// ✅ PASTIKAN import User entity dari path yang benar
import { User } from "../users/entities/user.entity";

// ✅ Interface untuk JWT Payload (type-safe)
interface JwtPayload {
  email: string;
  sub: string; // ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←...... WAJIB ADA!
  role: string;
  name?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  /**
   * Validate user credentials and return user object (without password)
   */
  async validateUser(email: string, password: string): Promise<any> {
    console.log(`🔐 [validateUser] Looking for: ${email}`);

    const user = await this.userRepository.findOne({
      where: { email },
      select: ["id", "email", "name", "role", "password", "isActive", "createdAt", "updatedAt"],
    });

    console.log(`🔐 [validateUser] Found:`, {
      id: user?.id,
      email: user?.email,
      role: user?.role,
      isActive: user?.isActive,
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isActive) {
        throw new UnauthorizedException("Account is deactivated");
      }
      // Return user without password
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Generate JWT token with proper payload including `sub: userId`
   */
  async login(user: any) {
    // 🔍 DEBUG: Log user object received
    console.log("🔐 [AuthService] Login user object:", {
      id: user?.id,
      email: user?.email,
      role: user?.role,
      name: user?.name,
    });

    // ✅ VALIDATION: Pastikan user.id ada sebelum generate token
    if (!user?.id) {
      console.error("❌ [AuthService] CRITICAL: user.id is undefined! Cannot generate valid JWT for RBAC.");
      throw new UnauthorizedException("Invalid user data: missing user ID");
    }

    // ✅ Fallback: jika role undefined, default ke 'user' atau cek dari email pattern
    const userRole = user?.role || (user?.email?.includes("admin") ? "admin" : "user");

    // ✅ JWT Payload - HARUS mengandung `sub: user.id` untuk RBAC
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id, // ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←...... PENTING!
      role: userRole,
      name: user.name,
    };

    // 🔍 DEBUG: Log payload sebelum sign
    console.log("🔐 [AuthService] JWT payload:", {
      email: payload.email,
      sub: payload.sub, // ← ← ← Pastikan ini ada & bukan undefined!
      role: payload.role,
      name: payload.name,
    });

    // ✅ Sign token
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: userRole,
        name: user.name,
        isActive: user.isActive,
      },
    };
  }

  /**
   * Register new user
   */
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

  /**
   * Get user profile by ID
   */
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
