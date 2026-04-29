import { type ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  color?: "gray" | "blue" | "green" | "yellow" | "red" | "emerald";
  className?: string;
}

export const Badge = ({ children, color = "gray", className = "", ...props }: BadgeProps) => {
  const colorStyles: Record<string, string> = {
    gray: "bg-gray-100 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
    emerald: "bg-emerald-100 text-emerald-800",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorStyles[color]} ${className}`} {...props}>
      {children}
    </span>
  );
};
