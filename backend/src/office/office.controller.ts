import { Controller, Get } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../auth/entities/user.entity";

@Controller("office")
export class OfficeController {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  // ✅ HEALTH CHECK ENDPOINT
  @Get("health")
  async health() {
    try {
      await this.userRepository.query("SELECT 1");
      return {
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: "error",
        database: "disconnected",
        error: error.message,
      };
    }
  }
}
