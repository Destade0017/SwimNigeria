import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage Component (Phase 3A)", () => {
  it("renders the primary display heading (H1)", () => {
    render(<HomePage />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: /SwimNigeria — Structured Swimming Education & Water Safety/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("provides primary and secondary calls to action with valid anchor targets", () => {
    render(<HomePage />);
    const primaryCta = screen.getByRole("link", { name: "Explore Learning Pathway" });
    const secondaryCta = screen.getByRole("link", { name: "Water Safety Principles" });

    expect(primaryCta).toBeInTheDocument();
    expect(primaryCta).toHaveAttribute("href", "#courses");

    expect(secondaryCta).toBeInTheDocument();
    expect(secondaryCta).toHaveAttribute("href", "#safety");

    const aboutLink = screen.getByRole("link", { name: /About Our Mission/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");

    const contactLink = screen.getByRole("link", { name: /Contact Directory/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("renders all major section landmarks and headings (H2)", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Why Structured Aquatic Education Matters",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Structured Learning Pathway",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Critical Water Safety Knowledge",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Educational Resources & Articles",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Community & Inquiries",
      }),
    ).toBeInTheDocument();
  });

  it("presents the 4 structured learning pathway stages", () => {
    render(<HomePage />);
    expect(screen.getByText("Water Safety & Acclimatization")).toBeInTheDocument();
    expect(screen.getByText("Buoyancy & Floating Mechanics")).toBeInTheDocument();
    expect(screen.getByText("Propulsion & Freestyle Basics")).toBeInTheDocument();
    expect(screen.getByText("Hazard Awareness & Self-Rescue")).toBeInTheDocument();
  });

  it("contains responsible water safety disclaimers", () => {
    render(<HomePage />);
    expect(
      screen.getByText(/Online educational lessons teach theoretical comprehension/i),
    ).toBeInTheDocument();
  });

  it("exports descriptive homepage-specific metadata", async () => {
    const { metadata } = await import("@/app/page");
    expect(metadata.title).toBe("SwimNigeria — Structured Swimming Education & Water Safety");
    expect(metadata.description).toContain("Accessible, structured swimming education");
    expect(metadata.openGraph?.title).toBe(
      "SwimNigeria — Structured Swimming Education & Water Safety",
    );
  });
});
