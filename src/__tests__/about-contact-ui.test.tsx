import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage, { metadata as aboutMetadata } from "@/app/about/page";
import ContactPage, { metadata as contactMetadata } from "@/app/contact/page";

describe("About Page Component (Phase 3)", () => {
  it("renders the primary display heading (H1)", () => {
    render(<AboutPage />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Empowering Nigerians with Structured Swimming Education and Water Safety",
    });
    expect(heading).toBeInTheDocument();
  });

  it("communicates why SwimNigeria exists and the need for drowning prevention", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Why SwimNigeria Exists" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Demystifying Water/i)).toBeInTheDocument();
    expect(screen.getByText(/Low-Bandwidth Reach/i)).toBeInTheDocument();
    expect(screen.getByText(/Adult Dignity/i)).toBeInTheDocument();
    expect(screen.getByText(/Community Defense/i)).toBeInTheDocument();
  });

  it("details the 3 educational philosophy pillars", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Our Educational Philosophy" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Theory Demystifies Fear")).toBeInTheDocument();
    expect(screen.getByText("Strict Sequential Progress")).toBeInTheDocument();
    expect(screen.getByText("Contextualized Safety")).toBeInTheDocument();
  });

  it("explicitly articulates the critical boundary between theory and certified in-person training", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "The Critical Balance: Theoretical Learning and Practical Coaching",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("What Digital Education Provides")).toBeInTheDocument();
    expect(screen.getByText("What Requires Certified In-Person Training")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Every credential issued by SwimNigeria explicitly represents a Certificate of Theoretical Course Completion/i,
      ),
    ).toBeInTheDocument();
  });

  it("provides accessible navigation CTAs to articles and contact", () => {
    render(<AboutPage />);
    const articlesCta = screen.getByRole("link", { name: "Explore Educational Articles" });
    const contactCta = screen.getByRole("link", { name: "Contact & Community Inquiries" });

    expect(articlesCta).toBeInTheDocument();
    expect(articlesCta).toHaveAttribute("href", "/articles");

    expect(contactCta).toBeInTheDocument();
    expect(contactCta).toHaveAttribute("href", "/contact");
  });

  it("defines meaningful SEO metadata for the About page", () => {
    expect(aboutMetadata.title).toBe("About Our Mission & Educational Philosophy | SwimNigeria");
    expect(aboutMetadata.description).toContain("Learn why SwimNigeria exists");
  });

  it("uses valid design system tokens for aquatic styling", () => {
    const { container } = render(<AboutPage />);
    const boundarySection = container.querySelector("section[aria-labelledby='boundary-heading']");
    expect(boundarySection).toHaveClass("bg-water-blue-50/40");
    expect(boundarySection).not.toHaveClass("bg-aquatic-blue-50/40");
  });
});

describe("Contact Page Component (Phase 3)", () => {
  it("renders the primary display heading (H1)", () => {
    render(<ContactPage />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Contact & Community Inquiries",
    });
    expect(heading).toBeInTheDocument();
  });

  it("truthfully handles pre-launch status without fabricated contact info or fake forms", () => {
    render(<ContactPage />);

    // Checks for pre-launch notice and Phase 10 roadmap dependency
    expect(
      screen.getByRole("heading", { level: 2, name: "Pre-Launch Communications Notice" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/scheduled for live activation in Phase 10/i)).toBeInTheDocument();
    expect(screen.getByText(/zero-fabrication engineering policy/i)).toBeInTheDocument();

    // Verifies no non-operational submit buttons or fake forms are rendered
    expect(screen.queryByRole("button", { name: /submit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /send/i })).not.toBeInTheDocument();
  });

  it("displays the 3 structured collaboration and inquiry tracks", () => {
    render(<ContactPage />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Inquiry Tracks & Collaboration Areas",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Educational & Curriculum Questions")).toBeInTheDocument();
    expect(screen.getByText("Certified Instructor Collaboration")).toBeInTheDocument();
    expect(screen.getByText("Community & School Safety")).toBeInTheDocument();
  });

  it("provides an inquiry preparation guide for prospective partners", () => {
    render(<ContactPage />);
    expect(
      screen.getByRole("heading", { level: 2, name: "How to Prepare Your Inquiry" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/1\. Identify Your Engagement Category/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Specify Regional or Environmental Context/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Clear Scope of Inquiry or Collaboration/i)).toBeInTheDocument();
  });

  it("links directly to immediate answers in the educational articles directory", () => {
    render(<ContactPage />);
    const articlesLink = screen.getByRole("link", {
      name: "Browse Educational Articles Directory",
    });
    expect(articlesLink).toBeInTheDocument();
    expect(articlesLink).toHaveAttribute("href", "/articles");

    const aboutLink = screen.getByRole("link", {
      name: "Read About Our Mission",
    });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("defines meaningful SEO metadata for the Contact page", () => {
    expect(contactMetadata.title).toBe("Contact & Community Inquiries | SwimNigeria");
    expect(contactMetadata.description).toContain(
      "educational questions, certified instructor collaboration",
    );
  });

  it("uses valid design system tokens for the status indicator", () => {
    const { container } = render(<ContactPage />);
    const pulseIndicator = container.querySelector(".animate-pulse");
    expect(pulseIndicator).toHaveClass("bg-water-blue-600");
    expect(pulseIndicator).not.toHaveClass("bg-aquatic-blue-600");
  });
});
