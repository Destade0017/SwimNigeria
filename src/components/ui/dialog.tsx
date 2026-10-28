"use client";

import React, { forwardRef, useEffect, useId, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closeOnBackdropClick?: boolean;
  titleId?: string;
  descriptionId?: string;
}

export const Dialog = ({
  isOpen,
  onClose,
  children,
  className,
  closeOnBackdropClick = true,
  titleId,
  descriptionId,
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Synchronize native HTML5 <dialog> modal state with React isOpen prop
  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    if (isOpen) {
      // Save previously focused element to return focus upon closing
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;

      if (!dialogElement.open) {
        dialogElement.showModal();
      }
    } else {
      if (dialogElement.open) {
        dialogElement.close();
      }
      // Return focus to previously focused element
      previouslyFocusedElementRef.current?.focus?.();
    }
  }, [isOpen]);

  // Handle native Escape key cancellation
  const handleCancel = useCallback(
    (event: React.SyntheticEvent<HTMLDialogElement, Event>) => {
      event.preventDefault(); // Prevent native close without React state update
      onClose();
    },
    [onClose],
  );

  // Handle click on backdrop (clicking outside dialog bounding rect)
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDialogElement>) => {
      if (!closeOnBackdropClick) return;
      const dialog = dialogRef.current;
      if (!dialog) return;

      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        onClose();
      }
    },
    [closeOnBackdropClick, onClose],
  );

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleClick}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={cn(
        "fixed inset-0 m-auto z-50 p-0 border-0 bg-transparent overflow-visible",
        "max-w-lg w-[calc(100%-2rem)] rounded-2xl shadow-xl",
        "focus:outline-none",
        className,
      )}
    >
      <div
        className={cn(
          "bg-neutral-white text-neutral-900 rounded-2xl border border-neutral-200",
          "p-6 shadow-2xl overflow-hidden flex flex-col gap-4",
          "max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain",
        )}
      >
        {children}
      </div>
    </dialog>
  );
};

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, children, onClose, showCloseButton = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-start justify-between gap-4 pb-2", className)}
        {...props}
      >
        <div className="flex flex-col space-y-1.5 text-left">{children}</div>
        {showCloseButton && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={cn(
              "p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600",
              "cursor-pointer select-none transition-colors shrink-0",
              "min-h-[44px] min-w-[44px] flex items-center justify-center",
            )}
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
DialogHeader.displayName = "DialogHeader";

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, as: Component = "h2", id, ...props }, ref) => {
    const defaultId = useId();
    return (
      <Component
        ref={ref}
        id={id || defaultId}
        className={cn("text-xl font-bold text-neutral-900 leading-tight", className)}
        {...props}
      />
    );
  },
);
DialogTitle.displayName = "DialogTitle";

export type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, id, ...props }, ref) => {
    const defaultId = useId();
    return (
      <p
        ref={ref}
        id={id || defaultId}
        className={cn("text-sm text-neutral-600 leading-relaxed", className)}
        {...props}
      />
    );
  },
);
DialogDescription.displayName = "DialogDescription";

export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-neutral-100",
          className,
        )}
        {...props}
      />
    );
  },
);
DialogFooter.displayName = "DialogFooter";
