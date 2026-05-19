// backend/src/users/users.service.ts
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      select: ["id", "email", "name", "role", "isActive", "createdAt", "updatedAt"],
      order: { createdAt: "DESC" },
    });
    return users as UserResponseDto[];
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ["id", "email", "name", "role", "isActive", "createdAt", "updatedAt"],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user as UserResponseDto;
  }

  // ✅ FIX: createdBy optional (?)
  async create(createUserDto: CreateUserDto, createdBy?: string): Promise<UserResponseDto> {
    const existing = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existing) throw new ConflictException("Email already registered");

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || "user",
      isActive: true,
    });

    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved;
    return result as UserResponseDto;
  }

  // ✅ FIX: requestedBy & requesterRole optional (?)
  async update(id: string, updateUserDto: UpdateUserDto, requestedBy?: string, requesterRole?: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    // Prevent non-admin from escalating their own role
    if (requestedBy === id && updateUserDto.role && requesterRole !== "admin") {
      throw new ForbiddenException("You cannot change your own role");
    }

    // Hash password if provided (type-safe!)
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update other fields
    Object.assign(user, updateUserDto);
    const updated = await this.userRepository.save(user);

    const { password, ...result } = updated;
    return result as UserResponseDto;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    // Soft delete: set isActive = false
    user.isActive = false;
    await this.userRepository.save(user);
  }

  async hardDelete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
