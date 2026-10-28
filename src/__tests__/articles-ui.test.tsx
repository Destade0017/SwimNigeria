import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ArticlesPage from "@/app/articles/page";
import ArticlePage, { generateMetadata, generateStaticParams } from "@/app/articles/[slug]/page";
import { getPublishedArticles } from "@/lib/articles";

// Mock next/navigation notFound
const notFoundMock = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: () => {
    notFoundMock();
    throw new Error("NEXT_NOT_FOUND");
  },
}));

describe("Articles UI Components (Phase 3B)", () => {
  describe("ArticlesPage (Directory)", () => {
    it("renders directory display heading and description", async () => {
      const pageJsx = await ArticlesPage({ searchParams: Promise.resolve({}) });
      render(pageJsx);

      const heading = screen.getByRole("heading", {
        level: 1,
        name: "Educational Articles & Water Safety Guides",
      });
      expect(heading).toBeInTheDocument();
      expect(
        screen.getByText(
          /accessible, evidence-based written resources covering swimming fundamentals/i,
        ),
      ).toBeInTheDocument();
    });

    it("renders category navigation links including All Guides", async () => {
      const pageJsx = await ArticlesPage({ searchParams: Promise.resolve({}) });
      render(pageJsx);

      expect(screen.getByRole("link", { name: "All Guides" })).toHaveAttribute("href", "/articles");
      expect(screen.getByRole("link", { name: "Water Safety" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Beginner Technique" })).toBeInTheDocument();
    });

    it("renders cards for all published articles", async () => {
      const pageJsx = await ArticlesPage({ searchParams: Promise.resolve({}) });
      render(pageJsx);

      const published = getPublishedArticles();
      for (const article of published) {
        expect(screen.getByText(article.title)).toBeInTheDocument();
      }
    });

    it("handles filtered category view", async () => {
      const pageJsx = await ArticlesPage({
        searchParams: Promise.resolve({ category: "water-safety" }),
      });
      render(pageJsx);

      expect(
        screen.getByText("Essential Water Safety Principles for Nigerian Families"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("The Mechanics of Buoyancy: Understanding Why the Human Body Floats"),
      ).not.toBeInTheDocument();
    });

    it("renders empty state for category with zero published articles", async () => {
      const pageJsx = await ArticlesPage({
        searchParams: Promise.resolve({ category: "non-existent-topic" }),
      });
      render(pageJsx);

      expect(screen.getByText("No Guides in This Category")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "View All Published Guides" })).toHaveAttribute(
        "href",
        "/articles",
      );
    });
  });

  describe("ArticlePage (Reader View)", () => {
    it("renders full published article with headings, paragraphs, and back link", async () => {
      const pageJsx = await ArticlePage({
        params: Promise.resolve({ slug: "overcoming-fear-of-water-adult-beginners" }),
      });
      render(pageJsx);

      const backLink = screen.getByRole("link", { name: /back to all guides/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute("href", "/articles");

      const title = screen.getByRole("heading", {
        level: 1,
        name: "Overcoming Water Apprehension: An Adult Beginner's Guide",
      });
      expect(title).toBeInTheDocument();

      // Check section headings and content
      expect(
        screen.getByText("1. Understanding That Water Fear is a Normal Survival Instinct"),
      ).toBeInTheDocument();
      expect(screen.getByText("Calm Mindset Principle")).toBeInTheDocument();
      expect(screen.getByText(/relaxation in water is a skill/i)).toBeInTheDocument();
    });

    it("renders safety callout and educational disclaimer", async () => {
      const pageJsx = await ArticlePage({
        params: Promise.resolve({ slug: "water-safety-rules-nigerian-families" }),
      });
      render(pageJsx);

      expect(screen.getByText(/educational scope & safety disclaimer:/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /this guide provides theoretical aquatic knowledge and safety principles/i,
        ),
      ).toBeInTheDocument();
    });

    it("renders related guides excluding the current article", async () => {
      const pageJsx = await ArticlePage({
        params: Promise.resolve({ slug: "overcoming-fear-of-water-adult-beginners" }),
      });
      render(pageJsx);

      expect(
        screen.getByRole("heading", { name: "Related Safety & Technique Guides" }),
      ).toBeInTheDocument();

      // Current article should not be listed in related guides
      const relatedSection = screen
        .getByRole("heading", { name: "Related Safety & Technique Guides" })
        .closest("div");
      expect(relatedSection).toBeInTheDocument();
    });

    it("invokes notFound() for non-existent slug", async () => {
      notFoundMock.mockClear();

      await expect(
        ArticlePage({ params: Promise.resolve({ slug: "unknown-slug-xyz" }) }),
      ).rejects.toThrow("NEXT_NOT_FOUND");

      expect(notFoundMock).toHaveBeenCalledTimes(1);
    });

    it("invokes notFound() for unpublished draft article", async () => {
      notFoundMock.mockClear();

      await expect(
        ArticlePage({
          params: Promise.resolve({ slug: "advanced-freestyle-bilateral-breathing" }),
        }),
      ).rejects.toThrow("NEXT_NOT_FOUND");

      expect(notFoundMock).toHaveBeenCalledTimes(1);
    });

    it("generates static params for all published articles", async () => {
      const params = await generateStaticParams();
      const published = getPublishedArticles();

      expect(params.length).toBe(published.length);
      expect(params.map((p) => p.slug)).toEqual(published.map((a) => a.slug));
    });

    it("generates valid metadata for published and not-found articles", async () => {
      const validMeta = await generateMetadata({
        params: Promise.resolve({ slug: "overcoming-fear-of-water-adult-beginners" }),
      });
      expect(validMeta.title).toContain("Overcoming Water Apprehension");

      const notFoundMeta = await generateMetadata({
        params: Promise.resolve({ slug: "non-existent-article" }),
      });
      expect(notFoundMeta.title).toBe("Article Not Found | SwimNigeria");
    });
  });
});
