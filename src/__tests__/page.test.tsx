import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage Component Baseline", () => {
  it("renders the primary SwimNigeria heading", () => {
    render(<HomePage />);
    const heading = screen.getByRole("heading", { level: 1, name: /SwimNigeria/i });
    expect(heading).toBeInTheDocument();
  });

  it("indicates operational foundation status", () => {
    render(<HomePage />);
    expect(screen.getByText(/System Operational/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 1 Baseline Infrastructure/i)).toBeInTheDocument();
  });

  it("lists key technical scaffolding elements", () => {
    render(<HomePage />);
    expect(screen.getByText(/Next.js App Router/i)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript Strict Checking/i)).toBeInTheDocument();
    expect(screen.getByText(/Tailwind CSS Design System Token Integration/i)).toBeInTheDocument();
  });
});
