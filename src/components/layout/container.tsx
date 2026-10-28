import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "article" | "main" | "header" | "footer" | "nav";
  size?: "default" | "narrow" | "prose" | "full";
  clean?: boolean;
}

const sizeClasses = {
  default: "max-w-7xl",
  narrow: "max-w-5xl",
  prose: "max-w-3xl",
  full: "max-w-full",
};

export const Container = forwardRef<HTMLElement, ContainerProps>(
  (
    { as: Component = "div", size = "default", clean = false, className, children, ...props },
    ref,
  ) => {
    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          "w-full mx-auto",
          sizeClasses[size],
          !clean && "px-4 sm:px-6 lg:px-8",
          className,
        ),
        ...props,
      },
      children,
    );
  },
);

Container.displayName = "Container";
