import { describe, expect, it } from "vitest";
import {
  ARTICLES_DATA,
  getPublishedArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getRelatedArticles,
  getCategories,
} from "@/lib/articles";

describe("Articles Content Model & Query Functions", () => {
  it("contains well-formed article records with valid slugs and required fields", () => {
    expect(ARTICLES_DATA.length).toBeGreaterThanOrEqual(3);

    for (const article of ARTICLES_DATA) {
      expect(article.slug).toMatch(/^[a-z0-9-]+$/);
      expect(article.title.length).toBeGreaterThan(5);
      expect(article.summary.length).toBeGreaterThan(15);
      expect(article.readTimeMinutes).toBeGreaterThan(0);
      expect(article.sections.length).toBeGreaterThan(0);
    }
  });

  it("filters and returns strictly published articles", () => {
    const published = getPublishedArticles();

    expect(published.length).toBeGreaterThan(0);
    for (const article of published) {
      expect(article.published).toBe(true);
    }

    // Must omit draft articles
    const draft = ARTICLES_DATA.find((a) => !a.published);
    expect(draft).toBeDefined();
    expect(published.some((a) => a.slug === draft?.slug)).toBe(false);
  });

  it("resolves published articles by slug", () => {
    const publishedList = getPublishedArticles();
    const target = publishedList[0];

    const result = getArticleBySlug(target.slug);
    expect(result).not.toBeNull();
    expect(result?.title).toBe(target.title);
  });

  it("returns null for non-existent slugs", () => {
    const result = getArticleBySlug("non-existent-article-slug");
    expect(result).toBeNull();
  });

  it("returns null for unpublished draft articles to prevent public access", () => {
    const draft = ARTICLES_DATA.find((a) => !a.published);
    expect(draft).toBeDefined();

    const result = getArticleBySlug(draft!.slug);
    expect(result).toBeNull();
  });

  it("filters articles by category with normalization", () => {
    const waterSafetyArticles = getArticlesByCategory("Water Safety");
    expect(waterSafetyArticles.length).toBeGreaterThan(0);
    for (const article of waterSafetyArticles) {
      expect(article.category).toBe("Water Safety");
    }

    // Handles slugified query string "water-safety"
    const slugQueryArticles = getArticlesByCategory("water-safety");
    expect(slugQueryArticles.length).toBe(waterSafetyArticles.length);

    // Returns empty array for unknown category
    const unknownCat = getArticlesByCategory("Unrecognized Category");
    expect(unknownCat).toEqual([]);
  });

  it("resolves related articles while excluding the active article", () => {
    const published = getPublishedArticles();
    const current = published[0];

    const related = getRelatedArticles(current.slug, current.category, 2);
    expect(related.length).toBeGreaterThan(0);
    expect(related.length).toBeLessThanOrEqual(2);
    expect(related.some((a) => a.slug === current.slug)).toBe(false);
  });

  it("returns list of unique categories from published articles", () => {
    const categories = getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(new Set(categories).size).toBe(categories.length);
  });
});
