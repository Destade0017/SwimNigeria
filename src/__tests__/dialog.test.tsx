import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

describe("Dialog Primitive Component", () => {
  it("renders with hidden attribute/class when isOpen is false", () => {
    render(
      <Dialog isOpen={false} onClose={() => {}}>
        <DialogTitle>Hidden Dialog</DialogTitle>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveClass("hidden");
  });

  it("automatically associates aria-labelledby and aria-describedby via DialogContext", () => {
    render(
      <Dialog isOpen={true} onClose={() => {}}>
        <DialogHeader>
          <DialogTitle>Confirm Enrollment</DialogTitle>
          <DialogDescription>You are enrolling in Water Safety Level 1.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");

    const title = screen.getByRole("heading", {
      name: /confirm enrollment/i,
    });
    const description = screen.getByText(/you are enrolling in water safety level 1/i);

    // Verify automatic context linking
    expect(dialog).toHaveAttribute("aria-labelledby", title.id);
    expect(dialog).toHaveAttribute("aria-describedby", description.id);
  });

  it("calls onClose when close icon button in header is clicked", () => {
    const handleClose = vi.fn();

    render(
      <Dialog isOpen={true} onClose={handleClose}>
        <DialogHeader onClose={handleClose}>
          <DialogTitle>Modal with Close</DialogTitle>
        </DialogHeader>
      </Dialog>,
    );

    const closeButton = screen.getByRole("button", { name: "Close dialog" });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when native cancel event (Escape) is triggered", () => {
    const handleClose = vi.fn();

    render(
      <Dialog isOpen={true} onClose={handleClose}>
        <DialogTitle>Escape Test</DialogTitle>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog");
    fireEvent(dialog, new Event("cancel"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("returns focus to the triggering element when the dialog closes", () => {
    const TestComponent = () => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div>
          <button type="button" id="trigger-btn" onClick={() => setIsOpen(true)}>
            Open Modal
          </button>
          <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <DialogHeader>
              <DialogTitle>Focus Management</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <button type="button" id="close-btn" onClick={() => setIsOpen(false)}>
                Dismiss Modal
              </button>
            </DialogFooter>
          </Dialog>
        </div>
      );
    };

    render(<TestComponent />);
    const trigger = screen.getByRole("button", { name: /open modal/i });

    // Focus trigger button and open dialog
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close dialog and verify focus returns to trigger
    const closeBtn = screen.getByRole("button", { name: "Dismiss Modal" });
    fireEvent.click(closeBtn);
    expect(document.activeElement).toBe(trigger);
  });
});
