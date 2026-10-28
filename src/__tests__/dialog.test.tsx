import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

describe("Dialog Primitive Component", () => {
  it("does not render into DOM when isOpen is false", () => {
    render(
      <Dialog isOpen={false} onClose={() => {}}>
        <DialogTitle>Hidden Dialog</DialogTitle>
      </Dialog>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders with accessible dialog role and modal attributes when isOpen is true", () => {
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
    expect(screen.getByRole("heading", { name: /confirm enrollment/i })).toBeInTheDocument();
    expect(screen.getByText(/you are enrolling in water safety level 1/i)).toBeInTheDocument();
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

    const closeButton = screen.getByRole("button", { name: /close dialog/i });
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
});
