import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import axe from "axe-core";
import HomePage from "@/app/page";

describe("Scaffold Accessibility Audit (axe-core)", () => {
  it("renders HomePage with zero automated accessibility violations", async () => {
    const { container } = render(<HomePage />);
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
