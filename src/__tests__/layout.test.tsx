import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import React from "react";
import { Container } from "@/components/layout/container";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileNav } from "@/components/layout/mobile-nav";

describe("Layout Foundations (Phase 2B)", () => {
  describe("Container Primitive", () => {
    it("renders children within standard max-width container", () => {
      render(<Container data-testid="test-container">Container Content</Container>);
      const container = screen.getByTestId("test-container");
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass("max-w-7xl", "mx-auto", "px-4");
    });

    it("supports polymorphic HTML element rendering", () => {
      render(
        <Container as="section" size="narrow" data-testid="section-container">
          Section Content
        </Container>,
      );
      const section = screen.getByTestId("section-container");
      expect(section.tagName).toBe("SECTION");
      expect(section).toHaveClass("max-w-5xl");
    });

    it("supports clean prop to remove horizontal padding", () => {
      render(
        <Container clean data-testid="clean-container">
          Full Bleed
        </Container>,
      );
      const container = screen.getByTestId("clean-container");
      expect(container).not.toHaveClass("px-4");
    });
  });

  describe("SiteHeader Component", () => {
    it("renders semantic header with accessible brand logo", () => {
      render(<SiteHeader />);
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();

      const homeLink = screen.getByRole("link", { name: /swimnigeria/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute("href", "/");
    });

    it("renders desktop navigation links", () => {
      render(<SiteHeader />);
      const nav = screen.getByRole("navigation", { name: /main navigation/i });
      expect(nav).toBeInTheDocument();

      expect(screen.getAllByRole("link", { name: "Home" })[0]).toHaveAttribute("href", "/");
      expect(screen.getAllByRole("link", { name: "Courses" })[0]).toHaveAttribute(
        "href",
        "/#courses",
      );
      expect(screen.getAllByRole("link", { name: "Safety Articles" })[0]).toHaveAttribute(
        "href",
        "/articles",
      );
    });

    it("provides an 'Explore Courses' call to action button", () => {
      render(<SiteHeader />);
      const cta = screen.getAllByRole("link", { name: "Explore Courses" })[0];
      expect(cta).toHaveAttribute("href", "/#courses");
    });
  });

  describe("MobileNav Component", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Courses", href: "/#courses" },
      { label: "About", href: "/#about" },
    ];

    it("toggles mobile navigation drawer and announces aria-expanded", () => {
      render(<MobileNav items={items} />);
      const menuButton = screen.getByRole("button", {
        name: /open mobile navigation menu/i,
      });

      expect(menuButton).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(menuButton);
      expect(menuButton).toHaveAttribute("aria-expanded", "true");

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();

      const drawerNav = screen.getByRole("navigation", {
        name: /mobile navigation/i,
      });
      expect(drawerNav).toBeInTheDocument();
    });

    it("closes drawer when close button inside header is clicked", () => {
      render(<MobileNav items={items} />);
      const menuButton = screen.getByRole("button", {
        name: /open mobile navigation menu/i,
      });

      fireEvent.click(menuButton);
      const closeButton = screen.getByRole("button", { name: "Close dialog" });

      fireEvent.click(closeButton);
      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });

    it("closes drawer when navigation link is clicked", () => {
      render(<MobileNav items={items} />);
      const menuButton = screen.getByRole("button", {
        name: /open mobile navigation menu/i,
      });

      fireEvent.click(menuButton);
      const coursesLink = screen.getByRole("link", { name: "Courses" });

      fireEvent.click(coursesLink);
      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("SiteFooter Component", () => {
    it("renders semantic footer with brand statement and links", () => {
      render(<SiteFooter />);
      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();

      expect(
        screen.getByText(/structured swimming instruction and vital water safety/i),
      ).toBeInTheDocument();
    });

    it("renders mandatory verbatim safety & educational disclaimer", () => {
      render(<SiteFooter />);
      const disclaimerHeading = screen.getByText(/mandatory safety & educational disclaimer:/i);
      expect(disclaimerHeading).toBeInTheDocument();

      const expectedDisclaimer =
        "Certificate of Theoretical Course Completion: This credential validates completion of digital coursework and water safety knowledge. It does not certify physical swimming competence, water survival capability, or lifeguarding qualification without practical, in-person assessment by a certified aquatic instructor.";

      expect(screen.getByText(expectedDisclaimer)).toBeInTheDocument();
    });

    it("renders copyright with current year", () => {
      render(<SiteFooter />);
      expect(screen.getByText(/© 2026 SwimNigeria\. All rights reserved\./i)).toBeInTheDocument();
    });
  });
});
