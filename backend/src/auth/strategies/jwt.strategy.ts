// backend/src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "fallback-secret-change-in-production",
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException("Token invalid");
    }

    // ✅ MINIMAL RETURN OBJECT - hanya field yang pasti ada di User entity
    return {
      sub: user.id, // ← ← ← WAJIB: agar controller bisa akses user?.sub
      email: user.email, // ← ← ← untuk logging/display
      role: user.role, // ← ← ← WAJIB: untuk RBAC role check
      name: user.name, // ← ← ← optional, untuk display
    };
  }
}
