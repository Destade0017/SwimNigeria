import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      id: explicitId,
      label,
      error,
      helperText,
      disabled,
      required,
      rows = 4,
      "aria-describedby": ariaDescribedByProp,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = explicitId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const describedByIds = [
      error ? errorId : null,
      helperText ? helperId : null,
      ariaDescribedByProp || null,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-neutral-900 select-none flex items-center justify-between"
          >
            <span>
              {label}
              {required && (
                <span className="text-brand-red-600 ml-1 font-semibold" aria-hidden="true">
                  *
                </span>
              )}
            </span>
          </label>
        )}

        <textarea
          ref={ref}
          id={id}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedByIds || undefined}
          className={cn(
            "w-full min-h-[100px] px-3.5 py-2.5 text-base sm:text-sm rounded-lg",
            "bg-neutral-white text-neutral-900 placeholder:text-neutral-600/60",
            "border border-neutral-200 transition-colors duration-150 resize-y",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            error
              ? "border-brand-red-600 focus-visible:ring-brand-red-600 focus-visible:border-brand-red-600"
              : "focus-visible:ring-brand-red-600 focus-visible:border-brand-red-600",
            "disabled:bg-neutral-100 disabled:opacity-60 disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-brand-red-600 flex items-center gap-1"
          >
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-neutral-600">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
