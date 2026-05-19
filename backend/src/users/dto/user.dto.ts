// backend/src/users/dto/user.dto.ts
import { IsString, IsEmail, IsOptional, IsBoolean, IsIn } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  password: string;

  @IsString()
  @IsIn(["admin", "user"])
  @IsOptional()
  role?: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsIn(["admin", "user"])
  @IsOptional()
  role?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  // ✅ TAMBAHKAN: password optional untuk update
  @IsString()
  @IsOptional()
  password?: string;
}

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
