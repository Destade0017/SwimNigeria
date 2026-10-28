import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "brand" | "aquatic" | "success" | "warning" | "outline";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-neutral-800 border-neutral-200",
  brand: "bg-brand-red-50 text-brand-red-700 border-brand-red-600/30",
  aquatic: "bg-water-blue-50 text-water-blue-700 border-water-blue-600/30",
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  outline: "bg-transparent text-neutral-800 border-neutral-300",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs font-medium",
  md: "px-2.5 py-1 text-xs font-semibold tracking-wide",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full border leading-none select-none whitespace-nowrap",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";
