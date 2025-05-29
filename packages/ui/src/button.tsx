"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant?: "primary" | "outline" | "secondary";
  className?: string;
  onClick?: () => void;
  size?: "lg" | "sm";
  children: ReactNode;
  disabled?: boolean;
}

export const Button = ({
  size = "lg",
  variant = "primary",
  className = "",
  onClick,
  children,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      className={`${className}
        ${variant === "primary" ? "bg-primary" : variant == "secondary" ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80" : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"}
        ${size === "lg" ? "px-4 py-2" : "px-2 py-1"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
