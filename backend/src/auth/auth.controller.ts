// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

// ✅ FIX: Tambahkan prefix 'office/' agar match dengan Caddy forwarding
@Controller("office/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }
}
