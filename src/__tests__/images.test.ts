import { describe, expect, it } from "vitest";
import {
  ARTICLE_IMAGES,
  COURSE_COVERS,
  HERO_IMAGE,
  HOME_VALUE_IMAGE,
  LESSON_IMAGES,
  getArticleImage,
  getCourseCover,
  getLessonImage,
  type PhotoAsset,
} from "@/lib/images";
import { getPreviewLessons, getPublishedCourses } from "@/lib/courses";
import { getPublishedArticles } from "@/lib/articles";

const ALL_ASSETS: PhotoAsset[] = [
  HERO_IMAGE,
  HOME_VALUE_IMAGE,
  ...Object.values(COURSE_COVERS),
  ...Object.values(ARTICLE_IMAGES),
  ...Object.values(LESSON_IMAGES),
];

describe("Photography registry (src/lib/images.ts)", () => {
  it("declares every asset with a valid CDN source, license page, author, and alt text", () => {
    for (const asset of ALL_ASSETS) {
      expect(asset.src).toMatch(/^https:\/\/images\.unsplash\.com\/photo-[\w-]+\?/);
      expect(asset.sourceUrl).toMatch(/^https:\/\/unsplash\.com\/photos\/[\w-]+$/);
      expect(asset.author.trim().length).toBeGreaterThan(0);
      expect(asset.alt.trim().length).toBeGreaterThan(0);
    }
  });

  it("maps every published course, article, and preview lesson to an image", () => {
    for (const course of getPublishedCourses()) {
      expect(getCourseCover(course.slug), `course ${course.slug}`).not.toBeNull();
    }
    for (const article of getPublishedArticles()) {
      expect(getArticleImage(article.slug), `article ${article.slug}`).not.toBeNull();
    }
    for (const item of getPreviewLessons()) {
      expect(getLessonImage(item.lesson.slug), `lesson ${item.lesson.slug}`).not.toBeNull();
    }
  });

  it("returns null for unregistered slugs instead of throwing", () => {
    expect(getCourseCover("open-water-endurance-survival")).toBeNull();
    expect(getArticleImage("no-such-article")).toBeNull();
    expect(getLessonImage("no-such-lesson")).toBeNull();
  });
});
