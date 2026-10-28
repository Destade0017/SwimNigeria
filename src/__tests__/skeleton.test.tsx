import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton Primitive Component", () => {
  it("renders with aria-hidden='true' to avoid screen reader clutter", () => {
    const { container } = render(<Skeleton className="h-6 w-32" data-testid="skeleton" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute("aria-hidden", "true");
    expect(element).toHaveClass("bg-neutral-200", "animate-pulse", "h-6", "w-32");
  });
});
