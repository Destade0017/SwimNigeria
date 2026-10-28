import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/badge";

describe("Badge Primitive Component", () => {
  it("renders with default variant styling", () => {
    render(<Badge>Beginner</Badge>);
    const badge = screen.getByText("Beginner");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-neutral-100");
  });

  it("supports brand, aquatic, and success variants", () => {
    const { rerender } = render(<Badge variant="brand">Urgent</Badge>);
    expect(screen.getByText("Urgent")).toHaveClass("bg-brand-red-50");

    rerender(<Badge variant="aquatic">Water Safety</Badge>);
    expect(screen.getByText("Water Safety")).toHaveClass("bg-water-blue-50");

    rerender(<Badge variant="success">Certified</Badge>);
    expect(screen.getByText("Certified")).toHaveClass("bg-emerald-50");
  });

  it("supports small size variant", () => {
    render(<Badge size="sm">Small Tag</Badge>);
    expect(screen.getByText("Small Tag")).toHaveClass("px-2", "text-xs");
  });
});
