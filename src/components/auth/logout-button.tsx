"use client";

/**
 * SwimNigeria — Logout Button Component
 *
 * Responsibilities:
 * - Provides an accessible interactive trigger for logging out of SwimNigeria.
 * - Invokes `logoutLearnerAction` server action.
 * - Handles pending state cleanly.
 */

import React, { useTransition } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { logoutLearnerAction } from "@/app/login/actions";

export interface LogoutButtonProps extends Omit<ButtonProps, "onClick" | "type"> {
  redirectTo?: string;
}

export function LogoutButton({
  redirectTo = "/",
  variant = "outline",
  size = "md",
  children = "Sign Out",
  ...props
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutLearnerAction(redirectTo);
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      isLoading={isPending}
      loadingText="Signing out..."
      {...props}
    >
      {children}
    </Button>
  );
}
