// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

// ✅ PASTIKAN import User entity dari path yang benar
import { User } from "../users/entities/user.entity"; // ← Sesuaikan path jika berbeda

@Injectable()
export class AuthService {
  constructor(
    // ✅ PASTIKAN inject Repository<User> dengan decorator @InjectRepository(User)
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // Note: password has select: false, so we add it explicitly
    const user = await this.userRepository.findOne({
      where: { email },
      select: ["id", "email", "name", "role", "password", "createdAt", "updatedAt"],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // ✅ PASTIKAN field 'role' disertakan di payload JWT
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role, // ← ← ← WAJIB ADA untuk RBAC
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role, // ← ← ← Juga kirim di response frontend
        name: user.name,
      },
    };
  }
}
