import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "interactive";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border bg-neutral-white text-neutral-900 shadow-xs overflow-hidden break-words",
          variant === "default" && "border-neutral-200 bg-neutral-white",
          variant === "muted" && "border-neutral-200 bg-neutral-50",
          variant === "interactive" &&
            "border-neutral-200 bg-neutral-white transition-all duration-150 hover:border-neutral-300 hover:shadow-sm cursor-pointer",
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6 pb-3", className)} {...props} />
    );
  },
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = "h3", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn("text-lg font-bold text-neutral-900 leading-tight tracking-tight", className)}
        {...props}
      />
    );
  },
);
CardTitle.displayName = "CardTitle";

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-neutral-600 leading-normal", className)}
        {...props}
      />
    );
  },
);
CardDescription.displayName = "CardDescription";

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6 pt-3 text-neutral-700 leading-relaxed text-sm sm:text-base", className)}
        {...props}
      />
    );
  },
);
CardContent.displayName = "CardContent";

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center p-6 pt-0 gap-3", className)} {...props} />
    );
  },
);
CardFooter.displayName = "CardFooter";
