// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from @Roles() decorator
    const requiredRoles = this.reflector.get<string[]>("roles", context.getHandler());

    // If no roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get request and user from context
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Set by JwtAuthGuard

    // Check if user exists and has required role
    if (!user || !user.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException("Access denied: insufficient permissions");
    }

    return true;
  }
}
