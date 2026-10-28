import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "aquatic" | "danger";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-red-600 text-neutral-white hover:bg-brand-red-700 active:bg-brand-red-800 focus-visible:ring-brand-red-600 border border-transparent shadow-xs",
  secondary:
    "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 focus-visible:ring-neutral-700 border border-transparent",
  outline:
    "bg-transparent text-neutral-900 border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:ring-neutral-900",
  ghost:
    "bg-transparent text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200 focus-visible:ring-neutral-900 border border-transparent",
  aquatic:
    "bg-water-blue-600 text-neutral-white hover:bg-water-blue-700 focus-visible:ring-water-blue-600 border border-transparent shadow-xs",
  danger:
    "bg-brand-red-600 text-neutral-white hover:bg-brand-red-700 focus-visible:ring-brand-red-600 border border-transparent shadow-xs",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md gap-1.5",
  md: "min-h-[44px] px-4 py-2.5 text-sm font-semibold rounded-lg gap-2",
  lg: "min-h-[48px] px-6 py-3 text-base font-semibold rounded-lg gap-2.5",
  icon: "min-h-[44px] min-w-[44px] p-2.5 rounded-lg justify-center",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      disabled,
      type = "button",
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading ? "true" : undefined}
        className={cn(
          "inline-flex items-center justify-center font-medium select-none cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "transition-all duration-150 ease-out",
          "active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0 motion-reduce:animate-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
            data-testid="button-spinner"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span>{isLoading && loadingText ? loadingText : children}</span>
      </button>
    );
  },
);

Button.displayName = "Button";
