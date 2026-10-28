"use client";

import React, {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import { cn } from "@/lib/utils";

interface DialogContextValue {
  titleId: string;
  descriptionId: string;
  onClose?: () => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export interface DialogProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closeOnBackdropClick?: boolean;
  titleId?: string;
  descriptionId?: string;
  variant?: "default" | "drawer";
}

export const Dialog = ({
  id,
  isOpen,
  onClose,
  children,
  className,
  closeOnBackdropClick = true,
  titleId: explicitTitleId,
  descriptionId: explicitDescriptionId,
  variant = "default",
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const generatedTitleId = useId();
  const generatedDescriptionId = useId();

  const titleId = explicitTitleId || generatedTitleId;
  const descriptionId = explicitDescriptionId || generatedDescriptionId;

  // Synchronize native HTML5 <dialog> modal state with React isOpen prop
  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;

      if (!dialogElement.open) {
        dialogElement.showModal();
      }
    } else {
      if (dialogElement.open) {
        dialogElement.close();
      }
      previouslyFocusedElementRef.current?.focus?.();
    }

    return () => {
      if (dialogElement.open) {
        dialogElement.close();
      }
      previouslyFocusedElementRef.current?.focus?.();
    };
  }, [isOpen]);

  // Handle native Escape key cancellation
  const handleCancel = useCallback(
    (event: React.SyntheticEvent<HTMLDialogElement, Event>) => {
      event.preventDefault(); // Prevent uncoordinated native close
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

  return (
    <DialogContext.Provider value={{ titleId, descriptionId, onClose }}>
      <dialog
        ref={dialogRef}
        id={id}
        onCancel={handleCancel}
        onClick={handleClick}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cn(
          "z-50 p-0 border-0 bg-transparent overflow-visible focus:outline-none",
          variant === "drawer"
            ? "fixed inset-y-0 right-0 m-0 ml-auto h-full max-h-screen w-full max-w-sm rounded-none border-l border-neutral-200"
            : "fixed inset-0 m-auto max-w-lg w-[calc(100%-2rem)] rounded-2xl shadow-xl",
          !isOpen && "hidden",
          className,
        )}
      >
        <div
          className={cn(
            "bg-neutral-white text-neutral-900 shadow-2xl flex flex-col overflow-y-auto overscroll-contain",
            variant === "drawer"
              ? "h-full min-h-screen p-6 gap-4"
              : "rounded-2xl border border-neutral-200 p-6 gap-4 max-h-[calc(100vh-4rem)]",
          )}
        >
          {children}
        </div>
      </dialog>
    </DialogContext.Provider>
  );
};

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, children, onClose: explicitOnClose, showCloseButton = true, ...props }, ref) => {
    const context = useContext(DialogContext);
    const onClose = explicitOnClose || context?.onClose;

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
  ({ className, as: Component = "h2", id: explicitId, ...props }, ref) => {
    const context = useContext(DialogContext);
    const defaultId = useId();
    const id = explicitId || context?.titleId || defaultId;

    return (
      <Component
        ref={ref}
        id={id}
        className={cn("text-xl font-bold text-neutral-900 leading-tight", className)}
        {...props}
      />
    );
  },
);
DialogTitle.displayName = "DialogTitle";

export type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, id: explicitId, ...props }, ref) => {
    const context = useContext(DialogContext);
    const defaultId = useId();
    const id = explicitId || context?.descriptionId || defaultId;

    return (
      <p
        ref={ref}
        id={id}
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
