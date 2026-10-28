import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button Primitive Component", () => {
  it("renders with default type='button' and primary variant", () => {
    render(<Button>Enroll Now</Button>);
    const button = screen.getByRole("button", { name: /enroll now/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("bg-brand-red-600");
  });

  it("supports explicit submit and reset native types", () => {
    const { rerender } = render(<Button type="submit">Submit Form</Button>);
    expect(screen.getByRole("button", { name: /submit form/i })).toHaveAttribute("type", "submit");

    rerender(<Button type="reset">Reset Form</Button>);
    expect(screen.getByRole("button", { name: /reset form/i })).toHaveAttribute("type", "reset");
  });

  it("merges custom className without wiping base variant styles", () => {
    render(<Button className="shadow-lg tracking-widest">Custom Button</Button>);
    const button = screen.getByRole("button", { name: /custom button/i });
    expect(button).toHaveClass("shadow-lg", "tracking-widest", "bg-brand-red-600");
  });

  it("renders with secondary, outline, and aquatic variants", () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-neutral-100");

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-neutral-200");

    rerender(<Button variant="aquatic">Aquatic</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-water-blue-600");
  });

  it("supports icon button size with accessible name", () => {
    render(
      <Button size="icon" aria-label="Close menu">
        ✕
      </Button>,
    );
    const button = screen.getByRole("button", { name: /close menu/i });
    expect(button).toHaveClass("min-h-[44px]", "min-w-[44px]");
  });

  it("triggers onClick callback when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables click interactions when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("displays loading spinner, sets aria-busy, and blocks clicks while loading", () => {
    const handleClick = vi.fn();
    render(
      <Button isLoading loadingText="Saving…" onClick={handleClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: /saving…/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("button-spinner")).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
