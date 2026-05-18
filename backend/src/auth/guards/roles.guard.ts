// backend/src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("Access denied: no user found in request");
    }

    // ✅ FIX: Flexible role extraction with fallback + normalization
    const rawRole = user?.role || user?.userRole || user?.roles || user?.permission || "";
    const userRole = String(rawRole).toLowerCase().trim();

    // 🐛 DEBUG: Log role check (bisa dihapus nanti)
    console.log(`🔐 [RolesGuard] Checking: required=[${requiredRoles}], userRole="${userRole}", rawUser=${JSON.stringify(user)}`);

    const hasRole = requiredRoles.some((role) => role.toLowerCase() === userRole);

    if (!hasRole) {
      console.log(`🔐 [RolesGuard] Forbidden: userRole="${userRole}" not in [${requiredRoles}]`);
      throw new ForbiddenException("Access denied: insufficient permissions");
    }

    return true;
  }
}
