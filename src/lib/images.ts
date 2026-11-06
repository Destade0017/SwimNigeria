/**
 * SwimNigeria — Centralized Photography Registry
 *
 * All photographic assets used across marketing and content pages are declared here so they
 * remain consistent, reusable, and easy to audit. Components must never hardcode image URLs.
 *
 * Sourcing & licensing:
 * - Every asset is a free-to-use photograph published under the Unsplash License
 *   (https://unsplash.com/license), hot-linked via the official images.unsplash.com CDN
 *   (Unsplash's recommended integration; no asset redistribution occurs).
 * - `sourceUrl` links to the canonical photo page for license traceability.
 * - Alt text describes only what is verifiably visible in each photograph (no fabricated
 *   instructors, learners, or contexts).
 *
 * Usage map:
 * - HERO_IMAGE ............ homepage hero background
 * - HOME_VALUE_IMAGE ...... homepage "Why Structured Aquatic Education Matters" banner
 * - COURSE_COVERS ......... catalogue cards + individual course pages (keyed by course slug)
 * - ARTICLE_IMAGES ........ published article detail heroes (keyed by article slug)
 * - LESSON_IMAGES ......... published preview lesson figures (keyed by lesson slug)
 */

export interface PhotoAsset {
  /** CDN URL served through next/image (remotePatterns: images.unsplash.com). */
  readonly src: string;
  /** Descriptive, truthful alternative text (WCAG 2.1 AA). */
  readonly alt: string;
  /** Photographer handle for credit captions. */
  readonly author: string;
  /** Canonical Unsplash page (license reference). */
  readonly sourceUrl: string;
}

export const HERO_IMAGE: PhotoAsset = {
  src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=2400",
  alt: "Swimmer mid-stroke above the lanes of an indoor competition pool",
  author: "Gentrit Sylejmani",
  sourceUrl: "https://unsplash.com/photos/JjUyjE-oEbM",
};

export const HOME_VALUE_IMAGE: PhotoAsset = {
  src: "https://images.unsplash.com/photo-1771317778033-3473a576c5e9?auto=format&fit=crop&q=80&w=2400",
  alt: "Clear blue water of a modern swimming pool bordered by deck steps and lush greenery",
  author: "Polina Kuzovkova",
  sourceUrl: "https://unsplash.com/photos/F9NYPMZK8H4",
};

/** Course cover images keyed by course slug. Only published launch courses are mapped. */
export const COURSE_COVERS: Readonly<Record<string, PhotoAsset>> = {
  "water-safety-overcoming-fear": {
    src: "https://images.unsplash.com/photo-1630049038179-afaaebb62fe2?auto=format&fit=crop&q=80&w=2400",
    alt: "Swimmer wearing a blue cap and goggles executing a stroke in a pool lined with lane floats",
    author: "Quimcy Dsouza",
    sourceUrl: "https://unsplash.com/photos/ihMLaTZdeWs",
  },
  "buoyancy-breathing-mechanics": {
    src: "https://images.unsplash.com/photo-1593055497705-59a84c5928b2?auto=format&fit=crop&q=80&w=2400",
    alt: "A swimmer seen from above through the surface of a pool lane",
    author: "Talahria Jensen",
    sourceUrl: "https://unsplash.com/photos/F20aPGvyhrQ",
  },
  "beginner-freestyle-propulsion": {
    src: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80&w=2400",
    alt: "Swimmer gliding freestyle through the lanes of an Olympic-sized pool",
    author: "Marcus Ng",
    sourceUrl: "https://unsplash.com/photos/ZbbhkQ0M2AM",
  },
};

/** Shared asset used by the buoyancy article hero and the Archimedes lesson figure. */
const WATER_RIPPLES: PhotoAsset = {
  src: "https://images.unsplash.com/photo-1562016600-ece13e8ba570?auto=format&fit=crop&q=80&w=2400",
  alt: "Sunlit ripples across the surface of crystal-blue water",
  author: "Wesley Tingey",
  sourceUrl: "https://unsplash.com/photos/9-OCsKoyQlk",
};

/** Article hero images keyed by article slug. Only published articles are mapped. */
export const ARTICLE_IMAGES: Readonly<Record<string, PhotoAsset>> = {
  "overcoming-fear-of-water-adult-beginners": {
    src: "https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?auto=format&fit=crop&q=80&w=2400",
    alt: "A lone swimmer moving calmly across a still, grey open-water lake",
    author: "Todd Quackenbush",
    sourceUrl: "https://unsplash.com/photos/E9PJO_vL3E8",
  },
  "water-safety-rules-nigerian-families": {
    src: "https://images.unsplash.com/photo-1651614158095-b98b6c1da74b?auto=format&fit=crop&q=80&w=2400",
    alt: "Group of children practising water-confidence skills together in a shallow pool",
    author: "Kevin Paes",
    sourceUrl: "https://unsplash.com/photos/1AZzPJWhyMQ",
  },
  "mechanics-of-buoyancy-why-bodies-float": WATER_RIPPLES,
};

/** Lesson figures keyed to published preview lesson slugs. */
export const LESSON_IMAGES: Readonly<Record<string, PhotoAsset>> = {
  "fear-as-a-survival-instinct": {
    src: "https://images.unsplash.com/photo-1560090995-01632a28895b?auto=format&fit=crop&q=80&w=2400",
    alt: "Several people swimming together in a pool",
    author: "Serena Repice Lentini",
    sourceUrl: "https://unsplash.com/photos/TVOAbbLL050",
  },
  "archimedes-principle-and-lung-volume": {
    ...WATER_RIPPLES,
    alt: "Rippling crystal-blue water surface illustrating displaced light and movement",
  },
  "hydrodynamic-drag-and-body-line": {
    src: "https://images.unsplash.com/photo-1560088937-d46f082d558b?auto=format&fit=crop&q=80&w=2400",
    alt: "Swimmer executing a freestyle arm recovery beside a lane float",
    author: "Serena Repice Lentini",
    sourceUrl: "https://unsplash.com/photos/q4tScOAuIm8",
  },
};

/** Resolve the cover image for a course slug, if one is registered. */
export function getCourseCover(courseSlug: string): PhotoAsset | null {
  return COURSE_COVERS[courseSlug] ?? null;
}

/** Resolve the hero image for a published article slug, if one is registered. */
export function getArticleImage(articleSlug: string): PhotoAsset | null {
  return ARTICLE_IMAGES[articleSlug] ?? null;
}

/** Resolve the figure image for a published preview lesson slug, if one is registered. */
export function getLessonImage(lessonSlug: string): PhotoAsset | null {
  return LESSON_IMAGES[lessonSlug] ?? null;
}
