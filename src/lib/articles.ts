export type ArticleCategory = "Water Safety" | "Beginner Technique" | "Community & Family";

export interface ArticleCallout {
  type: "safety" | "technique" | "info";
  title: string;
  message: string;
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  callout?: ArticleCallout;
}

export interface Article {
  slug: string;
  title: string;
  summary: string;
  category: ArticleCategory;
  readTimeMinutes: number;
  published: boolean;
  publishedAt: string; // ISO 8601 Date
  sections: ArticleSection[];
}

export const ARTICLES_DATA: readonly Article[] = [
  {
    slug: "overcoming-fear-of-water-adult-beginners",
    title: "Overcoming Water Apprehension: An Adult Beginner's Guide",
    summary:
      "Understand the physiological roots of water fear, discover natural human buoyancy, and take calm, dignified steps toward shallow-water comfort.",
    category: "Beginner Technique",
    readTimeMinutes: 4,
    published: true,
    publishedAt: "2026-10-15",
    sections: [
      {
        heading: "1. Understanding That Water Fear is a Normal Survival Instinct",
        paragraphs: [
          "Feeling nervous around water is not a character flaw—it is a deeply ingrained physiological survival mechanism. When an untrained person enters water, the brain instinctively triggers tension to keep the airways clear.",
          "However, physical tension in water is counterproductive. Tight muscles and rapid breathing reduce buoyancy and create feelings of heaviness. The first step toward swimming is not kicking or arm strokes; it is understanding how calm breathing unlocks natural flotation.",
        ],
        callout: {
          type: "technique",
          title: "Calm Mindset Principle",
          message:
            "Relaxation in water is a skill. You do not need to fight the water; water naturally pushes upwards against your body when your lungs are filled with gentle, calm air.",
        },
      },
      {
        heading: "2. The Physics of Human Buoyancy",
        paragraphs: [
          "The human body is composed primarily of water, muscle, bone, and adipose tissue. With air in your lungs, the average human body density is slightly less than the density of fresh water, meaning your natural state is to float.",
          "When beginners panic and exhale forcefully or arch their neck back sharply in anxiety, their center of mass shifts, causing their legs to sink. Learning to keep your head aligned neutrally with your spine is the key to effortless horizontal buoyancy.",
        ],
      },
      {
        heading: "3. Safe Shallow-Water Acclimatization Steps",
        paragraphs: [
          "Begin in waist-deep water where your feet can firmly touch the pool bottom at all times. Stand still and gently let the water support your hips and torso.",
          "Practice rhythmic breathing: take a normal breath above water, gently dip your mouth and nose below the surface, and blow steady bubbles before returning upright. Never hold your breath with forceful pressure.",
          "Progress to standing recovery drills: allow your feet to float gently off the bottom, then tuck your knees toward your chest, press your hands downward, and place your feet flat on the bottom. Knowing you can stand up at any time eliminates panic.",
        ],
        callout: {
          type: "safety",
          title: "Safety Reminder",
          message:
            "Always practice in certified shallow pools with an active lifeguard or a competent swimming companion present. Never attempt water acclimatization alone or in murky natural bodies of water.",
        },
      },
    ],
  },
  {
    slug: "water-safety-rules-nigerian-families",
    title: "Essential Water Safety Principles for Nigerian Families",
    summary:
      "Vital safety guidelines for parents, teachers, and community members around residential pools, hotel venues, and open waterways.",
    category: "Water Safety",
    readTimeMinutes: 5,
    published: true,
    publishedAt: "2026-10-20",
    sections: [
      {
        heading: "1. The Reality of Silent Drowning",
        paragraphs: [
          "In movies, drowning is portrayed as a loud, splashing spectacle accompanied by shouting for help. In reality, drowning is almost always deceptively quiet and rapid.",
          "When a person is in aquatic distress, the body's instinctive drowning response takes over. The respiratory system prioritizes breathing over speech, preventing the person from calling for help. Victims typically bob vertically at the surface for only 20 to 60 seconds before submerging.",
        ],
        callout: {
          type: "safety",
          title: "Critical Observation Rule",
          message:
            "A quiet swimmer who is vertical in the water without supportive kicking is often in serious distress. Never assume quietness means safety.",
        },
      },
      {
        heading: "2. Active Supervision Versus Passive Presence",
        paragraphs: [
          "Active adult supervision requires undistracted visual engagement. Sitting by a swimming pool while looking at a smartphone or reading a book does not constitute supervision.",
          "For young children or non-swimmers, supervision must be within 'touch supervision' distance—meaning an adult is within arm's reach at all times in the water.",
          "At family gatherings and hotel pools, designate a specific adult as the 'Water Watcher' wearing a visible wristband or holding a designated item for 15-minute shifts. When everyone assumes someone else is watching, accidents occur.",
        ],
      },
      {
        heading: "3. Non-Swimmer Bystander Rescue: 'Reach or Throw, Don't Go'",
        paragraphs: [
          "One of the leading causes of multiple drowning fatalities in Nigeria is untrained individuals jumping into deep or turbulent water to rescue a struggling family member or friend.",
          "A panicking person in water has immense adrenaline and will instinctively push down on their rescuer to keep their own mouth above the surface. Without professional lifeguard training, in-water rescue frequently results in both individuals drowning.",
          "Always follow the rescue sequence: Reach with a stick, broom, towel, or branch from a secure position on the bank; or Throw a buoyant object such as a life ring, plastic water container, or football attached to a line.",
        ],
        callout: {
          type: "info",
          title: "Community Safety Protocol",
          message:
            "Keep simple rescue aids (such as clean, empty 5-litre plastic water jugs tied to nylon cord) accessible near domestic and recreational water facilities.",
        },
      },
    ],
  },
  {
    slug: "mechanics-of-buoyancy-why-bodies-float",
    title: "The Mechanics of Buoyancy: Why the Human Body Floats",
    summary:
      "Explore the physical and physiological principles behind natural flotation, lung volume balance, and relaxed horizontal floating.",
    category: "Beginner Technique",
    readTimeMinutes: 4,
    published: true,
    publishedAt: "2026-10-25",
    sections: [
      {
        heading: "1. Archimedes' Principle Applied to Swimming",
        paragraphs: [
          "Archimedes' principle states that any object immersed in a fluid is buoyed up by a force equal to the weight of the fluid displaced by the object.",
          "Water has a density of approximately 1.0 grams per cubic centimeter. The human body varies between 0.96 and 1.05 g/cm³ depending on lung volume and body composition. When your lungs hold a comfortable volume of air, your overall body density drops below 1.0, enabling natural flotation.",
        ],
      },
      {
        heading: "2. The Lungs as Natural Flotation Devices",
        paragraphs: [
          "Your lungs hold between 4 and 6 liters of air during normal breathing. This air acts as an internal life jacket centered inside your ribcage.",
          "However, because the center of buoyancy is located in the chest while the center of gravity is near the hips and pelvis, human legs naturally tend to sink when floating on the back. This is normal biomechanics, not a personal failure.",
        ],
        callout: {
          type: "technique",
          title: "Technique Cue: Head Position",
          message:
            "Your head weighs between 4.5 and 5 kilograms. Lifting your chin out of alignment pushes your chest up and forces your hips and legs downward. Keeping your ears submerged and eyes looking directly skyward levels the body horizontally.",
        },
      },
      {
        heading: "3. The Starfish Float Drill",
        paragraphs: [
          "In shallow water with an instructor or partner, lie back gently with ears in the water. Spread your arms wide in a 'Y' shape and spread your legs into an 'X' shape.",
          "Spreading your limbs distributes body mass across a wider water surface area and brings your center of gravity closer to your center of buoyancy, making floating dramatically easier.",
          "Breathe calmly and smoothly: take shallow, rhythmic breaths without completely emptying your lungs at any point.",
        ],
      },
    ],
  },
  // Draft article for testing draft protection and 404 behavior
  {
    slug: "advanced-freestyle-bilateral-breathing",
    title: "Bilateral Breathing Mechanics for Intermediate Freestyle",
    summary:
      "Draft notes on developing an alternating 3-stroke breathing rhythm to balance body rotation and stroke symmetry.",
    category: "Beginner Technique",
    readTimeMinutes: 6,
    published: false,
    publishedAt: "2026-12-01",
    sections: [
      {
        heading: "Draft Review Section",
        paragraphs: [
          "This article is currently under internal review and has not yet been approved for public release. It must remain hidden from the directory and return 404 to the public.",
        ],
      },
    ],
  },
];

/**
 * Returns all published articles sorted by publication date descending.
 */
export function getPublishedArticles(): Article[] {
  return ARTICLES_DATA.filter((article) => article.published).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/**
 * Resolves a published article by slug. Returns null if not found or if unpublished.
 */
export function getArticleBySlug(slug: string): Article | null {
  const article = ARTICLES_DATA.find((a) => a.slug === slug);
  if (!article || !article.published) {
    return null;
  }
  return article;
}

/**
 * Returns published articles matching the specified category name.
 */
export function getArticlesByCategory(category: string): Article[] {
  const published = getPublishedArticles();
  if (!category || category === "all") {
    return published;
  }

  // Normalize comparison
  const normalizedQuery = category.toLowerCase().replace(/[^a-z0-9]/g, "");
  return published.filter((article) => {
    const normalizedCat = article.category.toLowerCase().replace(/[^a-z0-9]/g, "");
    return normalizedCat === normalizedQuery;
  });
}

/**
 * Returns related published articles in the same category or general list, excluding the current article.
 */
export function getRelatedArticles(currentSlug: string, category: string, limit = 2): Article[] {
  const published = getPublishedArticles().filter((a) => a.slug !== currentSlug);
  const sameCategory = published.filter((a) => a.category === category);

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const remaining = published.filter((a) => a.category !== category);
  return [...sameCategory, ...remaining].slice(0, limit);
}

/**
 * Returns distinct category names from all published articles.
 */
export function getCategories(): ArticleCategory[] {
  const categoriesSet = new Set<ArticleCategory>();
  for (const article of getPublishedArticles()) {
    categoriesSet.add(article.category);
  }
  return Array.from(categoriesSet);
}
