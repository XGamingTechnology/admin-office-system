// frontend/src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-blue-600"></i>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ FIX: Gunakan type assertion atau optional chaining untuk role
  const userRole = (user as any)?.role; // ← ← ← Quick fix: cast to any

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    console.log(`[RBAC] Access denied: user role "${userRole}" not in [${allowedRoles}]`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
