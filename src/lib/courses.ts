/**
 * SwimNigeria — Course Registry & Curriculum Data Model
 *
 * Implements a strongly typed, maintainable local course registry for launch courses.
 * This registry powers the Course Catalogue, Syllabus Exploration, and Preview Lesson features
 * prior to full database and authentication integration.
 *
 * Architectural notes:
 * - Compatible with docs/DATABASE_DESIGN.md (courses, lessons, categories).
 * - Enforces strict draft-content isolation: unpublished courses, modules, and lessons are
 *   never exposed through public query helpers.
 * - Enforces safety-first educational guidelines: digital theory never replaces certified
 *   in-person instruction in controlled aquatic facilities.
 */

export type DifficultyLevel = "foundational" | "beginner" | "intermediate";

export type CourseCategory =
  "Water Safety & Acclimatization" | "Buoyancy & Body Mechanics" | "Stroke Technique & Propulsion";

export type LessonCalloutType = "safety" | "technique" | "info";

export interface LessonCallout {
  type: LessonCalloutType;
  title: string;
  message: string;
}

export interface LessonSection {
  heading: string;
  paragraphs: string[];
  callout?: LessonCallout;
}

export interface LessonVideoReference {
  provider: "youtube" | "vimeo";
  videoId: string;
  title: string;
}

export interface Lesson {
  slug: string;
  title: string;
  summary: string;
  orderIndex: number;
  durationMinutes: number;
  isPreview: boolean;
  published: boolean;
  sections: LessonSection[];
  videoReference?: LessonVideoReference;
}

export interface CourseModule {
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  published: boolean;
  lessons: Lesson[];
}

export interface Course {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: CourseCategory;
  difficulty: DifficultyLevel;
  intendedAudience: string;
  prerequisites: string[];
  learningOutcomes: string[];
  estimatedDurationMinutes: number;
  displayOrder: number;
  published: boolean;
  publishedAt: string; // ISO 8601 Date
  isFree: boolean;
  modules: CourseModule[];
}

/**
 * Public preview lesson structure returned by getPreviewLessons().
 */
export interface PreviewLessonItem {
  courseSlug: string;
  courseTitle: string;
  moduleSlug: string;
  moduleTitle: string;
  lesson: Lesson;
}

/**
 * Sanitized public syllabus representation of a lesson.
 */
export interface SyllabusLesson {
  slug: string;
  title: string;
  summary: string;
  orderIndex: number;
  durationMinutes: number;
  isPreview: boolean;
}

/**
 * Sanitized public syllabus representation of a module.
 */
export interface SyllabusModule {
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  lessons: SyllabusLesson[];
}

/**
 * Complete public course syllabus structure.
 */
export interface CourseSyllabus {
  courseSlug: string;
  courseTitle: string;
  summary: string;
  category: CourseCategory;
  difficulty: DifficultyLevel;
  estimatedDurationMinutes: number;
  learningOutcomes: string[];
  prerequisites: string[];
  modules: SyllabusModule[];
}

/**
 * Mandatory educational and life-safety credential disclaimer.
 * Preserved verbatim as defined in authoritative project requirements.
 */
export const MANDATORY_CERTIFICATE_DISCLAIMER =
  "Certificate of Theoretical Course Completion: This credential validates completion of digital coursework and water safety knowledge. It does not certify physical swimming competence, water survival capability, or lifeguarding qualification without practical, in-person assessment by a certified aquatic instructor.";

/**
 * Master Course Registry containing launch curriculum and draft verification entries.
 */
export const COURSES_DATA: readonly Course[] = [
  // ---------------------------------------------------------------------------
  // COURSE 1: Water Safety & Overcoming Fear of Water
  // ---------------------------------------------------------------------------
  {
    slug: "water-safety-overcoming-fear",
    title: "Water Safety & Overcoming Fear of Water",
    summary:
      "A compassionate, evidence-based guide for non-swimmers to understand aquatic fear, master relaxed shallow-water breathing, and recognize life-saving hazard prevention rules.",
    description:
      "Overcoming fear of water is not about bravery or reckless immersion; it is an educational and psychological process of understanding how your body interacts with water. This foundational course is designed specifically for adult beginners, parents, and community members in Nigeria. You will discover the natural physiological mechanisms that cause water panic, learn gentle breath control exercises in safe standing depth, and establish life-saving hazard awareness for swimming pools, beaches, and riverine environments. Completion of this theoretical course equips learners with vital water safety knowledge, but does not certify in-water survival capability without certified practical training.",
    category: "Water Safety & Acclimatization",
    difficulty: "foundational",
    intendedAudience:
      "Adults, adolescents, parents, and educators who feel apprehension or anxiety around water, or who wish to build a rigorous conceptual safety foundation before in-person swimming lessons.",
    prerequisites: [
      "No prior swimming experience or athletic background required.",
      "An open mind and commitment to progressive, unforced learning.",
      "All physical acclimatization exercises must take place strictly in waist-deep water under active lifeguard or certified instructor supervision.",
    ],
    learningOutcomes: [
      "Explain the mammalian survival reflex and understand why physical tension causes sinking.",
      "Distinguish between calm rhythmic breathing and panic-induced hyperventilation.",
      "Execute safe shallow-water standing recovery from buoyant positions without distress.",
      "Recognize the signs of silent drowning and distinguish active supervision from passive presence.",
      "Apply the bystander rescue rule ('Reach or Throw, Never Go') to avoid double-drowning emergencies.",
    ],
    estimatedDurationMinutes: 50,
    displayOrder: 1,
    published: true,
    publishedAt: "2026-10-20",
    isFree: true,
    modules: [
      {
        slug: "understanding-aquatic-fear",
        title: "Module 1: The Physiology & Psychology of Water Fear",
        description:
          "Examine the evolutionary instincts behind water apprehension and learn how tension impairs natural flotation.",
        orderIndex: 1,
        published: true,
        lessons: [
          {
            slug: "fear-as-a-survival-instinct",
            title: "Understanding Fear as a Natural Survival Instinct",
            summary:
              "Reframe water apprehension as a healthy protective reflex rather than a personal weakness.",
            orderIndex: 1,
            durationMinutes: 7,
            isPreview: true,
            published: true,
            sections: [
              {
                heading: "The Evolutionary Basis of Aquatic Anxiety",
                paragraphs: [
                  "Water fear is not a personal failure, a character defect, or a lack of courage. It is an ancient, deeply programmed evolutionary survival mechanism designed to protect air-breathing terrestrial mammals from airway compromise.",
                  "When an untrained person stands near or enters water, the nervous system instinctively detects the absence of solid ground support. In response, the brain's amygdala initiates a fight-or-flight cascade: muscles stiffen, heart rate spikes, and respiration becomes shallow and rapid.",
                  "Understanding that this reaction is biological rather than emotional allows adult learners to approach water with patience and self-compassion rather than shame.",
                ],
                callout: {
                  type: "info",
                  title: "Educational Mindset Principle",
                  message:
                    "You cannot force relaxation through willpower. Relaxation in water begins with intellectual understanding: when you know why your body reacts, you can consciously choose calm, measured steps.",
                },
              },
              {
                heading: "Why Tension Sinks the Human Body",
                paragraphs: [
                  "The human body's average density with air in the lungs is slightly lower than the density of fresh water. Consequently, when calm and relaxed, the body naturally wants to stay at the surface.",
                  "When anxiety causes a swimmer to tense their neck, clench their jaw, and grip their abdominal wall, two detrimental things occur: the volume of usable lung air decreases, and the center of mass tilts backward, pulling the hips and legs downward.",
                  "Physical tension is the single largest contributor to feeling heavy in water. Learning to release tension is the true first milestone of swimming, preceding any kicking or stroking techniques.",
                ],
                callout: {
                  type: "safety",
                  title: "Crucial Safety Rule",
                  message:
                    "Never attempt to overcome water apprehension by forcing yourself into deep water or enduring traumatic submersion. Water acclimation must always be voluntary, gradual, and conducted in shallow water with certified supervision.",
                },
              },
            ],
          },
          {
            slug: "calm-breathing-vs-panic-hyperventilation",
            title: "Calm Rhythmic Breathing Versus Panic Hyperventilation",
            summary:
              "Learn the vital differences between relaxed breath exchange and dangerous breath-holding or hyperventilation.",
            orderIndex: 2,
            durationMinutes: 8,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "The Mechanics of Breath in Aquatic Environments",
                paragraphs: [
                  "Inexperienced swimmers often believe they must take gigantic, gasping breaths and hold them tightly with closed throats. This practice, known as the Valsalva maneuver, creates elevated intrathoracic pressure, induces lightheadedness, and heightens feelings of panic.",
                  "Calm swimming requires continuous, rhythmic respiration: gentle, unforced inhalation through the mouth above water, followed by a slow, relaxed exhalation through the nose or mouth.",
                  "Air retained calmly in the lungs provides approximately 4 to 6 liters of buoyant volume, functioning as an internal life vest. However, this buoyancy is optimized when air is cycled smoothly rather than locked in with anxiety.",
                ],
              },
              {
                heading: "Avoiding Hyperventilation & Breath-Holding Risks",
                paragraphs: [
                  "Rapid, shallow panting (hyperventilation) blows off carbon dioxide without increasing oxygen delivery, triggering dizziness and muscle spasms.",
                  "Conversely, prolonged competitive breath-holding is extremely dangerous and can cause hypoxic blackout (shallow water blackout) even in shallow water.",
                  "Our goal is always calm tidal breathing: regular, rhythmic inhalations and deliberate, bubbling exhalations.",
                ],
                callout: {
                  type: "safety",
                  title: "Absolute Life-Safety Rule",
                  message:
                    "SwimNigeria strictly forbids intentional hyperventilation or prolonged underwater breath-holding drills. All breathing practice must be calm, relaxed, and performed in waist-deep water.",
                },
              },
            ],
          },
        ],
      },
      {
        slug: "shallow-water-acclimatization",
        title: "Module 2: Shallow-Water Acclimatization & Standing Recovery",
        description:
          "Practical step-by-step procedures for building comfort in waist-deep water where your feet remain firmly on the bottom.",
        orderIndex: 2,
        published: true,
        lessons: [
          {
            slug: "safe-entry-and-waist-deep-grounding",
            title: "Safe Pool Entry and Waist-Deep Grounding",
            summary:
              "Establish solid physical comfort and sensory acclimatization in certified standing-depth pool facilities.",
            orderIndex: 1,
            durationMinutes: 8,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "Entering the Water Safely & Dignified",
                paragraphs: [
                  "Always enter swimming pools using steps with sturdy handrails, facing into the pool, or by gently lowering yourself from the pool deck with both hands supporting your body weight.",
                  "Never jump, dive, or step blindly into water whose depth and floor gradient you have not visually verified.",
                  "Move to waist-deep water—where the water level reaches approximately between your navel and lower ribs. At this depth, your feet maintain full, solid friction with the pool floor, eliminating any risk of being swept away.",
                ],
              },
              {
                heading: "Sensing Hydrostatic Pressure and Water Support",
                paragraphs: [
                  "Stand still with feet shoulder-width apart. Let your arms rest softly in the water beside your hips.",
                  "Gently bend your knees until the water rises to your chest, then slowly straighten your legs again. Notice the upward buoyant force against your thighs and torso.",
                  "This gentle upward pressure is hydrostatic buoyancy. Water is not trying to pull you under; it is consistently supporting over 80% of your body weight.",
                ],
                callout: {
                  type: "technique",
                  title: "Grounding Anchor Technique",
                  message:
                    "Whenever you feel a momentary surge of anxiety during shallow-water drills, simply exhale gently, stand flat on both soles, and feel the solid bottom beneath you. You are always in control.",
                },
              },
            ],
          },
          {
            slug: "the-standing-recovery-drill",
            title: "The Essential Standing Recovery Technique",
            summary:
              "Master the single most important safety skill: returning your feet securely to the pool floor from any floating position.",
            orderIndex: 2,
            durationMinutes: 10,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "Why Standing Recovery Eliminates Water Panic",
                paragraphs: [
                  "The root cause of panic during floating drills is the fear of being unable to stand up. Beginners worry that if they lie back or tip forward, they will remain stuck horizontally.",
                  "Once a learner understands the biomechanics of standing recovery, fear diminishes immediately because they possess an autonomous emergency stop mechanism.",
                ],
              },
              {
                heading: "The Three-Step Standing Sequence",
                paragraphs: [
                  "Step 1 — Tuck the Knees: From a floating position, draw both knees up toward your chest into a compact seated tuck. This immediately shifts your center of gravity under your torso.",
                  "Step 2 — Downward Hand Press: Press both palms downward toward the pool bottom in a gentle breaststroke sweep. Water resistance pushes your head and chest upright.",
                  "Step 3 — Extend Feet to Floor: Extend your legs straight down, place both soles flat on the pool floor, and stand tall with your head well clear of the surface.",
                ],
                callout: {
                  type: "safety",
                  title: "Supervised Practice Directive",
                  message:
                    "Never practice floating without first mastering the standing recovery drill with a certified instructor or lifeguard standing right beside you.",
                },
              },
            ],
          },
        ],
      },
      {
        slug: "aquatic-hazard-recognition",
        title: "Module 3: Hazard Awareness & Non-Contact Bystander Rescue",
        description:
          "Essential aquatic safety awareness for Nigerian families, covering pool barriers, open water risks, and the bystander rescue rule.",
        orderIndex: 3,
        published: true,
        lessons: [
          {
            slug: "silent-drowning-and-active-supervision",
            title: "The Reality of Silent Drowning and Active Supervision",
            summary:
              "Dispel Hollywood drowning myths and learn the subtle indicators of genuine aquatic distress.",
            orderIndex: 1,
            durationMinutes: 8,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "Debunking the Hollywood Myth of Loud Drowning",
                paragraphs: [
                  "Popular media portrays drowning as a loud, dramatic event filled with thrashing arms and shouted cries for help. In reality, physiological drowning is almost universally quiet and deceptively rapid.",
                  "When a person enters water distress, the respiratory system prioritizes breathing over vocalization. A struggling individual cannot shout because their mouth bobs momentarily above the water line before submerging.",
                  "Similarly, the instinctive drowning response forces the victim's arms to press laterally down onto the water surface in an attempt to elevate the mouth, preventing purposeful waving for assistance.",
                ],
              },
              {
                heading: "Active Supervision versus Passive Distraction",
                paragraphs: [
                  "Active adult supervision requires focused visual attention without electronic distraction. Looking at a mobile device, talking on the phone, or reading a book while children are near water does not constitute supervision.",
                  "For non-swimmers and young children, supervision must be within arm's reach—known internationally as 'touch supervision'.",
                ],
                callout: {
                  type: "safety",
                  title: "Family Water Safety Rule",
                  message:
                    "If a swimmer becomes quiet, still, or adopts a vertical body posture with head tilted back, intervene immediately. Never wait for splashing or shouting.",
                },
              },
            ],
          },
          {
            slug: "reach-or-throw-never-enter",
            title: "The Golden Bystander Rule: Reach or Throw, Never Go",
            summary:
              "Learn why untrained bystander in-water rescues frequently prove fatal, and master safe shore-based rescue methods.",
            orderIndex: 2,
            durationMinutes: 9,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "The Danger of Untrained In-Water Rescues",
                paragraphs: [
                  "In Nigeria and globally, tragic incidents regularly occur where well-meaning bystanders drown trying to rescue someone in distress. A panicking person experiences an overwhelming survival impulse to climb onto anything nearby, including the rescuer.",
                  "Without professional lifesaving equipment and specialized training, entering the water to save a drowning person puts two lives at extreme risk and frequently results in double fatalities.",
                ],
              },
              {
                heading: "Safe Non-Contact Rescue Sequence",
                paragraphs: [
                  "1. TALK: Call out loudly and calmly to the person: 'Kick your legs! Reach for the wall! Help is coming!'",
                  "2. REACH: Lie flat on your stomach on the deck or bank to avoid being pulled in. Extend a long, rigid object: a broom handle, pool pole, branch, or towel.",
                  "3. THROW: Toss a buoyant item directly to the victim: a life ring, kickboard, empty sealed 5-liter plastic container, or cooler.",
                  "4. ROW / CALL: If available, use a boat or call immediately for professional emergency personnel and lifeguards.",
                ],
                callout: {
                  type: "safety",
                  title: "Cardinal Bystander Principle",
                  message:
                    "Never jump into water to rescue someone unless you are a certified lifeguard equipped with a rescue flotation device. Reach or throw from dry ground.",
                },
              },
            ],
          },
        ],
      },
      // Draft module to test module-level draft isolation
      {
        slug: "advanced-distress-response-concepts",
        title: "Module 4: Advanced Aquatic Distress Response (In Review)",
        description:
          "Internal review draft exploring community aquatic emergency protocols. Must remain isolated from public queries.",
        orderIndex: 4,
        published: false,
        lessons: [
          {
            slug: "incident-reporting-protocols",
            title: "Facility Emergency Incident Reporting Protocols",
            summary: "Draft guidance for documenting aquatic incidents.",
            orderIndex: 1,
            durationMinutes: 10,
            isPreview: true, // Intentionally true to test that preview in draft module is blocked!
            published: false,
            sections: [
              {
                heading: "Draft Review Only",
                paragraphs: [
                  "This lesson is under internal editorial review and must never be exposed to public routes or syllabus queries.",
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // COURSE 2: Buoyancy & Breathing Mechanics
  // ---------------------------------------------------------------------------
  {
    slug: "buoyancy-breathing-mechanics",
    title: "Buoyancy & Breathing Mechanics",
    summary:
      "Understand the scientific principles of human flotation, head-spine alignment, and rhythmic breath exchange to float effortlessly and safely.",
    description:
      "Swimming is an aquatic dance with physics rather than a battle against water. This beginner course breaks down Archimedes' principle of flotation, human anatomy, and respiratory dynamics into intuitive, practical concepts. You will discover why human legs tend to sink, how subtle head adjustments function as an aquatic rudder, and how to exchange air continuously through the nose and mouth without swallowing water. Theoretical comprehension of buoyancy equips learners with the knowledge required to eliminate panic, but must always be paired with certified shallow-water pool practice to build physical competence.",
    category: "Buoyancy & Body Mechanics",
    difficulty: "beginner",
    intendedAudience:
      "Learners who have completed basic shallow-water acclimatization and want to understand the physical and biomechanical foundations of effortless floating.",
    prerequisites: [
      "Basic shallow-water comfort (ability to stand calmly in waist-deep water).",
      "Completion of Water Safety & Overcoming Fear of Water or equivalent introductory safety knowledge.",
      "Access to a controlled swimming pool with a certified instructor or lifeguard for all physical practice.",
    ],
    learningOutcomes: [
      "Apply Archimedes' principle to understand why human bodies float naturally when lungs contain calm air.",
      "Explain why the separation between center of gravity and center of buoyancy causes sinking legs.",
      "Demonstrate neutral cervical head alignment to keep the hips elevated horizontally.",
      "Perform unforced, continuous exhalation underwater (blowing bubbles) without hyperventilation.",
      "Execute stable starfish back floats and prone floats with safe standing recovery.",
    ],
    estimatedDurationMinutes: 65,
    displayOrder: 2,
    published: true,
    publishedAt: "2026-10-22",
    isFree: true,
    modules: [
      {
        slug: "physics-of-flotation",
        title: "Module 1: The Physics of Flotation — Archimedes in the Pool",
        description:
          "Discover how buoyant force counteracts gravity when your lungs are filled with calm air and your body is relaxed.",
        orderIndex: 1,
        published: true,
        lessons: [
          {
            slug: "archimedes-principle-and-lung-volume",
            title: "Archimedes' Principle and Human Body Density",
            summary:
              "Explore the physical laws that govern why human bodies float naturally in fresh and chlorinated water.",
            orderIndex: 1,
            durationMinutes: 9,
            isPreview: true,
            published: true,
            sections: [
              {
                heading: "The Upward Buoyant Force",
                paragraphs: [
                  "Over 2,200 years ago, the Greek mathematician Archimedes discovered that an object immersed in a fluid is buoyed up by a force equal to the weight of the fluid displaced by the object.",
                  "Fresh water has a specific gravity of 1.0. The human body—composed of water, bone, muscle, and adipose tissue—typically has a specific gravity varying between 0.96 and 1.02 depending on lung inflation.",
                  "When your lungs are filled with normal tidal air, your average specific gravity drops below 1.0. This means you are lighter than the volume of water you displace, and water will naturally lift you toward the surface.",
                ],
                callout: {
                  type: "technique",
                  title: "Debunking the 'Heavy Bones' Myth",
                  message:
                    "Many adult beginners believe their bones or muscles are 'too dense' to float. While lean muscle tissue has higher density than fat, relaxed lungs provide more than enough buoyant displacement for every human body to float when properly aligned.",
                },
              },
              {
                heading: "The Role of Lungs as Internal Buoyancy Compensators",
                paragraphs: [
                  "Your lungs hold between 4 to 6 liters of air. In aquatic terms, this acts as an internal life ring positioned directly in your thoracic cavity.",
                  "When beginners become anxious and completely blow out all their air in one frantic burst, their buoyancy drops instantly, causing them to submerge briefly and panic.",
                  "By learning to breathe in rhythmic cycles—retaining a comfortable residual volume at all times—you preserve continuous upward lift.",
                ],
              },
            ],
          },
          {
            slug: "center-of-gravity-vs-center-of-buoyancy",
            title: "Center of Gravity Versus Center of Buoyancy",
            summary:
              "Understand the biomechanical teeter-totter effect that causes legs to sink when floating horizontally.",
            orderIndex: 2,
            durationMinutes: 10,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "The Two Competing Centers of the Human Body",
                paragraphs: [
                  "In terrestrial standing, your center of gravity (CG) is located near your pelvis and sacrum. Gravity pulls downward through this point.",
                  "In water, an additional force exists: the center of buoyancy (CB), which is located in your chest where your air-filled lungs reside. Buoyant force pushes upward through this thoracic point.",
                  "Because these two points are physically separated by 20 to 30 centimeters, they create a rotational torque—similar to a teeter-totter or seesaw. The chest is pushed upward while the heavy, muscular legs are pulled downward.",
                ],
              },
              {
                heading: "How to Balance the Aquatic Seesaw",
                paragraphs: [
                  "Beginners often fight this rotational force by frantically kicking their legs, which quickly exhausts their stamina.",
                  "The scientific solution is geometrical: by extending your arms past your head in a wide 'Y' shape, you shift body mass upward toward your head, bringing your center of gravity closer to your center of buoyancy and naturally leveling your hips.",
                ],
                callout: {
                  type: "info",
                  title: "Biomechanics Insight",
                  message:
                    "Your legs sink not because you are doing something wrong, but because of basic physics. Accepting this reality allows you to use head position and arm extension to balance effortlessly.",
                },
              },
            ],
          },
        ],
      },
      {
        slug: "head-alignment-and-respiration",
        title: "Module 2: Head Alignment & Rhythmic Water Breathing",
        description:
          "Master neutral cervical posture and gentle underwater exhalation to eliminate water inhalation and fatigue.",
        orderIndex: 2,
        published: true,
        lessons: [
          {
            slug: "the-head-as-the-bodys-rudder",
            title: "The Head as the Body's Aquatic Rudder",
            summary:
              "Discover how slight tilting of your 5-kilogram head directly dictates hip position and water drag.",
            orderIndex: 1,
            durationMinutes: 10,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "The Heavy Head Principle",
                paragraphs: [
                  "The average human adult head weighs between 4.5 and 5.5 kilograms. In water, wherever your head goes, your body inevitably follows.",
                  "If an anxious swimmer lifts their chin to look forward, the heavy skull rises out of the water. Because that weight is no longer supported by buoyancy, it pushes the chest down and drives the hips and legs deep into the water.",
                  "Conversely, keeping the head aligned neutrally with the spine—with ears submerged in back floating or eyes directed toward the pool floor in prone floating—allows the skull's weight to counterbalance the hips, keeping the body sleek and horizontal.",
                ],
                callout: {
                  type: "technique",
                  title: "Alignment Cue",
                  message:
                    "Imagine a gentle rod running from the crown of your head straight down your spine. Keep that line neutral; do not crane your neck backward or tuck your chin rigidly into your chest.",
                },
              },
            ],
          },
          {
            slug: "bubble-blowing-and-airway-protection",
            title: "Relaxed Face Immersion and Continuous Bubble Blowing",
            summary:
              "Learn the art of slow, unforced exhalation through the nose and mouth to keep water out of your airways.",
            orderIndex: 2,
            durationMinutes: 11,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "Why Water Enters the Nose and How to Prevent It",
                paragraphs: [
                  "Water only enters the nasal cavity when there is negative pressure (inhaling) or neutral air pressure with turbulent movement.",
                  "By maintaining a gentle, continuous stream of bubbles from your nose or mouth whenever your face is submerged, you create positive outward air pressure that physically prevents water from entering.",
                  "Practice blowing bubbles in waist-deep water with your chin and mouth submerged, humming softly to ensure a smooth, measured rate of exhalation.",
                ],
                callout: {
                  type: "safety",
                  title: "Supervised Drills Directive",
                  message:
                    "Always practice face immersion drills while standing securely in waist-deep water holding onto the pool wall or a partner's hands. Never hold your nose closed with your fingers, as this builds poor dependence.",
                },
              },
            ],
          },
        ],
      },
      {
        slug: "floating-drills-and-recovery",
        title: "Module 3: Relaxed Floating & Safe Recovery Transitions",
        description:
          "Executing stable back and prone floats with effortless transitions back to vertical standing.",
        orderIndex: 3,
        published: true,
        lessons: [
          {
            slug: "the-starfish-back-float",
            title: "The Starfish Back Float Fundamentals",
            summary:
              "Master the posture and breathing rhythm for an effortless, stable back float in shallow water.",
            orderIndex: 1,
            durationMinutes: 12,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "Setting Up the Starfish Position",
                paragraphs: [
                  "The back float is the safest survival posture in swimming because it allows your mouth and nose to remain clear of the water for uninhibited breathing without arm or leg fatigue.",
                  "In waist-deep water with a companion or instructor supporting your upper back, gently recline until your ears are submerged. Spread your arms into a wide 'Y' shape and open your legs into an 'X' shape.",
                  "Direct your gaze straight upward toward the ceiling or sky. Relax your belly and hips, allowing water to lap gently around your hairline.",
                ],
              },
              {
                heading: "Executing the Recovery from the Back Float",
                paragraphs: [
                  "To stand up from a back float, bring your chin gently toward your chest, draw your knees up toward your stomach, sweep your hands forward and downward, and drop your feet flat to the bottom.",
                  "Never attempt to stand by arching your back or flailing backward. The knee-tuck always guarantees a clean, upright recovery.",
                ],
                callout: {
                  type: "technique",
                  title: "Breathing Rhythm on the Back",
                  message:
                    "Breathe shallowly and rhythmically: inhale calmly through your mouth, pause for a second, then exhale slowly. Never empty your lungs completely.",
                },
              },
            ],
          },
          {
            slug: "prone-floating-and-torpedo-glide",
            title: "Prone Floating & The Torpedo Glide",
            summary:
              "Experience effortless horizontal face-down balance and the foundational push-off glide.",
            orderIndex: 2,
            durationMinutes: 13,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "The Mushroom and Jellyfish Float",
                paragraphs: [
                  "The mushroom float is an introductory exercise that proves to your brain that water lifts your body. In waist-deep water, take a normal breath, bend your knees, tuck your chin, and hug your shins with both hands.",
                  "Within one second, your back and hips will rise smoothly to the surface, demonstrating that you cannot sink when your lungs are filled with air.",
                ],
              },
              {
                heading: "The Streamlined Torpedo Push-Off",
                paragraphs: [
                  "Facing away from the pool wall in waist-deep water, place one foot against the wall. Extend both arms straight ahead with one hand resting flat over the other, squeezing your biceps against your ears.",
                  "Take a comfortable breath, gently lower your face into the water, and push smoothly off the wall with your foot. Glide forward silently and horizontally without kicking or stroking.",
                ],
                callout: {
                  type: "safety",
                  title: "Controlled Space Requirement",
                  message:
                    "Only perform push-and-glide drills in open, clear swimming lanes where you cannot collide with pool steps, lane dividers, or other swimmers.",
                },
              },
            ],
          },
          // Draft lesson inside published module to test lesson-level draft isolation
          {
            slug: "deep-water-vertical-treading-preview",
            title: "Deep Water Vertical Treading Mechanics (In Review)",
            summary: "Draft notes on eggbeater kick mechanics for deep water.",
            orderIndex: 3,
            durationMinutes: 12,
            isPreview: true, // Intentionally true to test that unpublished lesson is excluded!
            published: false,
            sections: [
              {
                heading: "Draft Lesson Notice",
                paragraphs: [
                  "This lesson is under editorial review and must be excluded from public course queries, syllabi, and preview registries.",
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // COURSE 3: Beginner Freestyle & Horizontal Propulsion
  // ---------------------------------------------------------------------------
  {
    slug: "beginner-freestyle-propulsion",
    title: "Beginner Freestyle & Horizontal Propulsion",
    summary:
      "Learn the core biomechanics of freestyle swimming: streamlined posture, relaxed hip-driven flutter kicking, efficient arm pull, and rhythmic side-breathing.",
    description:
      "Freestyle (front crawl) is the most efficient, universally recognized swimming stroke. However, many adult beginners exhaust themselves within fifteen meters because they kick from the knees and lift their heads high out of the water to breathe. This beginner stroke course provides structured, step-by-step biomechanical instruction. You will learn how to maintain a sleek hydrodynamic body line, generate propulsion from your hip flexors with loose ankles, pull water backward with high-elbow mechanics, and rotate smoothly along your longitudinal axis for effortless side-breathing. Remember: digital coursework establishes the cognitive blueprint for technique; physical mastery requires structured, supervised pool practice.",
    category: "Stroke Technique & Propulsion",
    difficulty: "beginner",
    intendedAudience:
      "Swimmers who are comfortable floating on their front and back, can recover to their feet autonomously, and are ready to learn continuous forward swimming.",
    prerequisites: [
      "Comfortable with full face immersion and relaxed bubble blowing.",
      "Demonstrated ability to perform a stable back float and prone float with independent standing recovery.",
      "Access to a 25-meter or 15-meter shallow or graduated pool with active lifeguard oversight.",
    ],
    learningOutcomes: [
      "Adopt a hydrodynamic 'streamline' position that reduces frontal water drag.",
      "Execute a continuous, relaxed flutter kick originating from the hips rather than the knees.",
      "Demonstrate high-elbow catch and pull mechanics that propel water directly backward.",
      "Perform bilateral or unilateral side-breathing with head rotation rather than head lifting.",
      "Integrate kick, arm stroke, and body rotation into a sustainable, rhythmic stroke cycle.",
    ],
    estimatedDurationMinutes: 75,
    displayOrder: 3,
    published: true,
    publishedAt: "2026-10-25",
    isFree: true,
    modules: [
      {
        slug: "streamlining-and-drag-reduction",
        title: "Module 1: Streamlining & Hydrodynamic Posture",
        description:
          "Minimize frontal water resistance by maintaining a sleek, taut horizontal profile across the water's surface.",
        orderIndex: 1,
        published: true,
        lessons: [
          {
            slug: "hydrodynamic-drag-and-body-line",
            title: "Understanding Hydrodynamic Drag & The Body Line",
            summary:
              "Learn how water resistance affects swimming velocity and why body position matters more than brute muscular force.",
            orderIndex: 1,
            durationMinutes: 11,
            isPreview: true,
            published: true,
            sections: [
              {
                heading: "The Physical Reality of Moving Through Water",
                paragraphs: [
                  "Water is approximately 800 times denser than air and roughly 55 times more viscous. In running or cycling, effort translates directly into speed. In swimming, however, frontal drag increases quadratically with velocity.",
                  "This means that pushing twice as hard against water resistance requires four times the energy. The fastest and most sustainable way to swim is not to pull harder, but to make your body as sleek and narrow as an arrow.",
                  "A swimmer who maintains a pristine horizontal line will travel farther and faster with minimal effort than an athletic powerhouse whose hips and legs drag 30 degrees below the surface.",
                ],
                callout: {
                  type: "technique",
                  title: "The Golden Rule of Propulsion",
                  message:
                    "Efficiency comes from reducing drag first, and adding propulsion second. Always fix your horizontal balance before attempting to stroke faster.",
                },
              },
              {
                heading: "The Streamline Stance",
                paragraphs: [
                  "To form an optimal streamline: place one hand over the back of the other, interlock your top thumb around the edge of the lower hand, and press your arms straight above your head.",
                  "Squeeze your biceps gently behind your ears, lengthen your spine, and point your toes softly. This eliminates gaps between your arms and head where turbulent vortices of water could create drag.",
                ],
              },
            ],
          },
          {
            slug: "longitudinal-body-rotation",
            title: "Longitudinal Axis Body Rotation",
            summary:
              "Discover why swimming on your side is faster, easier on the shoulders, and essential for relaxed breathing.",
            orderIndex: 2,
            durationMinutes: 12,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "Swimming 'On Your Edge' Rather Than Flat",
                paragraphs: [
                  "Novice swimmers often attempt to swim freestyle completely flat on their stomachs, like a barge pushing through mud. This flat posture puts severe mechanical strain on the rotator cuff muscles during the arm recovery.",
                  "Proper freestyle rotates continuously along the long axis of your spine—from your head down to your toes. As your right arm reaches forward, your entire torso and hips rotate 35 to 45 degrees onto your right side.",
                  "This longitudinal roll allows the back muscles (latissimus dorsi) to power the stroke instead of the small deltoid muscles, creating effortless power and opening a natural air pocket for breathing.",
                ],
                callout: {
                  type: "info",
                  title: "Rotation Analogy",
                  message:
                    "Think of your body as a boat hull slicing cleanly through water, rather than a raft slapping against the surface.",
                },
              },
            ],
          },
        ],
      },
      {
        slug: "flutter-kick-mechanics",
        title: "Module 2: The Flutter Kick — Propulsion from the Hips",
        description:
          "Develop an effortless, continuous kick that stabilizes the hips rather than exhausting cardiovascular energy.",
        orderIndex: 2,
        published: true,
        lessons: [
          {
            slug: "kicking-from-the-hips-not-knees",
            title: "Kicking from the Hips, Not the Knees",
            summary:
              "Eliminate the 'bicycle kick' mistake and cultivate a loose, whiplike propulsive leg motion.",
            orderIndex: 1,
            durationMinutes: 12,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "The Fatal 'Bicycle Kick' Error",
                paragraphs: [
                  "The most common mistake among adult beginners is bending their knees excessively and cycling their legs as if riding a bicycle.",
                  "Bending the knees drops the thighs downward against the oncoming water flow, transforming the legs from propulsive fins into giant underwater brakes that drag the entire lower body down.",
                ],
              },
              {
                heading: "The Hip-Driven Whiplike Motion",
                paragraphs: [
                  "An effective flutter kick originates entirely from the hip flexors and gluteal muscles. The legs remain relatively long, with a soft, supple micro-bend at the knee.",
                  "The ankles must be completely relaxed and pointed softly backward, functioning like rubber swim fins. The top of your foot pushes water backward on the downbeat, while the hamstring lifts the leg on the upbeat.",
                  "The kick envelope should be compact: feet stay within a vertical depth of approximately 30 to 40 centimeters, just breaking the surface with a gentle boil of white water, never a loud, chaotic splash.",
                ],
                callout: {
                  type: "technique",
                  title: "Ankle Flexibility Cue",
                  message:
                    "Keep your ankles as loose as wet spaghetti. Stiff, flexed ankles act like anchors; pointed, relaxed ankles act like propellers.",
                },
              },
            ],
          },
          {
            slug: "kickboard-drills-and-breath-integration",
            title: "Kickboard Drills and Shallow-Water Practice",
            summary:
              "Structure your shallow-water kicking practice to build leg endurance without compromising neck posture.",
            orderIndex: 2,
            durationMinutes: 13,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "Proper Kickboard Mechanics",
                paragraphs: [
                  "When using a kickboard, hold the far top edge lightly with your hands, resting your forearms along the board. Do not grip it tightly or press down on it with your chest.",
                  "Keep your face down in the water with eyes looking at the pool floor, breathing out gentle bubbles. Lift your head smoothly to inhale only when necessary, and immediately return your face to the water.",
                  "This drill separates leg propulsive development from arm coordination, allowing you to feel the continuous rhythm of your kick.",
                ],
                callout: {
                  type: "safety",
                  title: "Pool Depth Precaution",
                  message:
                    "Always conduct kickboard drills in designated swimming lanes of consistent depth. Avoid practicing near pool drains or steep drop-offs if you are still developing independent buoyancy.",
                },
              },
            ],
          },
        ],
      },
      {
        slug: "arm-stroke-and-side-breathing",
        title: "Module 3: Arm Stroke Mechanics & Side-Breathing",
        description:
          "Coordinate continuous arm propulsion with rhythmic lateral head rotation for clean air intake.",
        orderIndex: 3,
        published: true,
        lessons: [
          {
            slug: "catch-pull-and-high-elbow-recovery",
            title: "Catch, Pull, and High-Elbow Recovery",
            summary:
              "Master the path of the hand through the water to maximize propulsive thrust and protect shoulder joints.",
            orderIndex: 1,
            durationMinutes: 13,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "The Three Phases of the Underwater Arm Stroke",
                paragraphs: [
                  "Phase 1 — The Entry and Catch: Your hand enters the water fingertips first, with palm tilted slightly outward, directly in line with your shoulder. Reach forward into the water as if sliding your arm through a tight mail slot.",
                  "Phase 2 — The Pull: Bend your elbow slightly to anchor your forearm against the water (the 'high elbow catch'). Pull your body past your hand, accelerating water directly backward toward your thigh.",
                  "Phase 3 — The Exit and Recovery: Release the water at your hip. Lift your elbow high and relaxed out of the water, letting your wrist and fingers dangle softly as they travel forward for the next entry.",
                ],
              },
            ],
          },
          {
            slug: "side-breathing-in-the-bow-wave-pocket",
            title: "Side-Breathing in the Bow Wave Pocket",
            summary:
              "Learn to rotate your head along the body's longitudinal axis to breathe cleanly without lifting your neck.",
            orderIndex: 2,
            durationMinutes: 14,
            isPreview: false,
            published: true,
            sections: [
              {
                heading: "Finding the Natural Breathing Pocket",
                paragraphs: [
                  "As a swimmer glides horizontally through water, their head pushes a small bow wave forward, creating a trough or air pocket right beside the cheek and ear.",
                  "To take a breath, you do not lift your head. Instead, you rotate your body and head simultaneously toward the side as your arm finishes its stroke.",
                  "Keep one goggle lens submerged in the water while the other lens clears the surface. Your mouth opens in the bow wave depression to inhale fresh air quickly and cleanly, then rotates smoothly back down into the water.",
                ],
                callout: {
                  type: "safety",
                  title: "Critical Stroke Cue",
                  message:
                    "If you lift your forehead out of the water to breathe, your hips will immediately sink like lead weights. Always rotate your head to the side; never lift it forward.",
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // COURSE 4: Open Water Safety & Coastal Survival Concepts (Draft Course)
  // ---------------------------------------------------------------------------
  // Intentionally unpublished to test that draft courses are completely isolated
  // from public listings, slug lookups, and preview lesson queries.
  {
    slug: "open-water-endurance-survival",
    title: "Open Water Safety & Coastal Survival Concepts",
    summary:
      "Draft syllabus exploring tidal currents, rip currents, lagoon navigation, and survival flotation in non-pool environments.",
    description:
      "This draft curriculum addresses open-water swimming environments such as ocean beaches, rivers, and lagoons across Nigeria. It remains in internal development and must never be exposed publicly until reviewed by certified marine rescue personnel.",
    category: "Water Safety & Acclimatization",
    difficulty: "intermediate",
    intendedAudience: "Advanced learners preparing for supervised open-water environments.",
    prerequisites: ["Proficiency in 100 meters continuous swimming in certified pools."],
    learningOutcomes: [
      "Identify rip currents and tidal sweeps from coastal shorelines.",
      "Understand survival floating dynamics in turbulent non-pool water.",
      "Recognize regional hazards in Nigerian estuaries and lagoons.",
    ],
    estimatedDurationMinutes: 90,
    displayOrder: 4,
    published: false,
    publishedAt: "2026-12-01",
    isFree: false,
    modules: [
      {
        slug: "rip-current-dynamics",
        title: "Module 1: Rip Currents & Coastal Shorebreak (Draft)",
        description: "Draft principles of oceanic current physics.",
        orderIndex: 1,
        published: false,
        lessons: [
          {
            slug: "identifying-rip-currents-from-shore",
            title: "Identifying Rip Currents from Shore",
            summary: "Draft checklist for recognizing rip currents.",
            orderIndex: 1,
            durationMinutes: 15,
            isPreview: true, // Intentionally true to verify that draft course preview is BLOCKED!
            published: false,
            sections: [
              {
                heading: "Draft Review Section",
                paragraphs: [
                  "This lesson is under editorial review and must be excluded from all public queries.",
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

// =============================================================================
// INTERNAL QUERY UTILITIES & ISOLATION HELPERS
// =============================================================================

/**
 * Strips unpublished modules and unpublished lessons from a course object.
 * Returns null if the course itself is unpublished.
 */
function sanitizeCourseForPublic(course: Course): Course | null {
  if (!course.published) {
    return null;
  }

  // Filter modules to only published ones, and sort by orderIndex
  const publishedModules: CourseModule[] = course.modules
    .filter((mod) => mod.published)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((mod) => {
      // Filter lessons to only published ones, and sort by orderIndex
      const publishedLessons: Lesson[] = mod.lessons
        .filter((lesson) => lesson.published)
        .sort((a, b) => a.orderIndex - b.orderIndex);

      return {
        ...mod,
        lessons: publishedLessons,
      };
    });

  return {
    ...course,
    modules: publishedModules,
  };
}

// =============================================================================
// PUBLIC QUERY HELPERS
// =============================================================================

/**
 * Returns all published courses sorted deterministically by displayOrder.
 * Unpublished modules and unpublished lessons are strictly stripped from results.
 */
export function getPublishedCourses(): Course[] {
  return COURSES_DATA.filter((c) => c.published)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((c) => sanitizeCourseForPublic(c))
    .filter((c): c is Course => c !== null);
}

/**
 * Resolves a published course by slug. Returns null if not found or if unpublished.
 * All draft modules and lessons within the resolved course are stripped out.
 */
export function getCourseBySlug(slug: string): Course | null {
  if (!slug) {
    return null;
  }

  const course = COURSES_DATA.find((c) => c.slug === slug);
  if (!course || !course.published) {
    return null;
  }

  return sanitizeCourseForPublic(course);
}

/**
 * Returns all lessons designated for public preview across all published courses.
 * Enforces strict cascading isolation:
 * - Parent course MUST be published.
 * - Parent module MUST be published.
 * - Lesson itself MUST be published.
 * - Lesson MUST have isPreview === true.
 */
export function getPreviewLessons(): PreviewLessonItem[] {
  const results: PreviewLessonItem[] = [];

  const publishedCourses = COURSES_DATA.filter((c) => c.published).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  for (const course of publishedCourses) {
    const publishedModules = course.modules
      .filter((m) => m.published)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    for (const moduleItem of publishedModules) {
      const previewLessons = moduleItem.lessons
        .filter((l) => l.published && l.isPreview)
        .sort((a, b) => a.orderIndex - b.orderIndex);

      for (const lesson of previewLessons) {
        results.push({
          courseSlug: course.slug,
          courseTitle: course.title,
          moduleSlug: moduleItem.slug,
          moduleTitle: moduleItem.title,
          lesson,
        });
      }
    }
  }

  return results;
}

/**
 * Retrieves the published syllabus for a course by slug.
 * Returns a sanitized structure containing published modules and lessons only.
 * Returns null if the course is not found or is unpublished.
 */
export function getCourseSyllabus(courseSlug: string): CourseSyllabus | null {
  const course = getCourseBySlug(courseSlug);
  if (!course) {
    return null;
  }

  const modules: SyllabusModule[] = course.modules.map((mod) => ({
    slug: mod.slug,
    title: mod.title,
    description: mod.description,
    orderIndex: mod.orderIndex,
    lessons: mod.lessons.map((lesson) => ({
      slug: lesson.slug,
      title: lesson.title,
      summary: lesson.summary,
      orderIndex: lesson.orderIndex,
      durationMinutes: lesson.durationMinutes,
      isPreview: lesson.isPreview,
    })),
  }));

  return {
    courseSlug: course.slug,
    courseTitle: course.title,
    summary: course.summary,
    category: course.category,
    difficulty: course.difficulty,
    estimatedDurationMinutes: course.estimatedDurationMinutes,
    learningOutcomes: course.learningOutcomes,
    prerequisites: course.prerequisites,
    modules,
  };
}

/**
 * Resolves a specific published lesson within a published course.
 * Returns null if course, module, or lesson does not exist or is unpublished.
 */
export function getLessonBySlug(
  courseSlug: string,
  lessonSlug: string,
): { course: Course; module: CourseModule; lesson: Lesson } | null {
  const course = getCourseBySlug(courseSlug);
  if (!course) {
    return null;
  }

  for (const moduleItem of course.modules) {
    const lesson = moduleItem.lessons.find((l) => l.slug === lessonSlug);
    if (lesson && lesson.published) {
      return {
        course,
        module: moduleItem,
        lesson,
      };
    }
  }

  return null;
}

/**
 * Checks whether a specific lesson is eligible for public unauthenticated preview.
 * Returns true ONLY if course is published, parent module is published,
 * lesson is published, and lesson has isPreview === true.
 */
export function isLessonPreviewEligible(courseSlug: string, lessonSlug: string): boolean {
  const resolved = getLessonBySlug(courseSlug, lessonSlug);
  if (!resolved) {
    return false;
  }

  return resolved.lesson.isPreview === true;
}

/**
 * Returns published courses matching the specified category name.
 * Normalizes query string for robust comparison.
 */
export function getCoursesByCategory(category: string): Course[] {
  const published = getPublishedCourses();
  if (!category || category === "all") {
    return published;
  }

  const normalizedQuery = category.toLowerCase().replace(/[^a-z0-9]/g, "");
  return published.filter((course) => {
    const normalizedCat = course.category.toLowerCase().replace(/[^a-z0-9]/g, "");
    return normalizedCat === normalizedQuery;
  });
}

/**
 * Returns unique category names from all currently published courses.
 */
export function getCourseCategories(): CourseCategory[] {
  const categoriesSet = new Set<CourseCategory>();
  for (const course of getPublishedCourses()) {
    categoriesSet.add(course.category);
  }
  return Array.from(categoriesSet);
}

/**
 * Returns unique difficulty levels from all currently published courses.
 */
export function getCourseDifficulties(): DifficultyLevel[] {
  const difficultiesSet = new Set<DifficultyLevel>();
  for (const course of getPublishedCourses()) {
    difficultiesSet.add(course.difficulty);
  }
  return Array.from(difficultiesSet);
}

export interface CourseFilterOptions {
  category?: string;
  difficulty?: string;
}

/**
 * Filters published courses by category and/or difficulty.
 * Safely handles unknown filter values by returning an empty array.
 * Preserves deterministic displayOrder sorting.
 */
export function getFilteredCourses(options: CourseFilterOptions = {}): Course[] {
  let courses = getPublishedCourses();

  if (options.category && options.category !== "all") {
    const normalizedQuery = options.category.toLowerCase().replace(/[^a-z0-9]/g, "");
    courses = courses.filter((course) => {
      const normalizedCat = course.category.toLowerCase().replace(/[^a-z0-9]/g, "");
      return normalizedCat === normalizedQuery;
    });
  }

  if (options.difficulty && options.difficulty !== "all") {
    const normalizedQuery = options.difficulty.toLowerCase().trim();
    courses = courses.filter((course) => course.difficulty.toLowerCase() === normalizedQuery);
  }

  return courses;
}

/**
 * Safe video embed structure with validated IDs and privacy-respecting URLs.
 */
export interface SafeVideoEmbed {
  provider: "youtube" | "vimeo";
  embedUrl: string;
  watchUrl: string;
  title: string;
}

/**
 * Validates a lesson's video reference and constructs safe embed/watch URLs.
 * Returns null if the video reference is absent, unsupported, or has an invalid ID format.
 */
export function getSafeVideoEmbed(video?: LessonVideoReference): SafeVideoEmbed | null {
  if (!video || !video.videoId || !video.provider) {
    return null;
  }

  // Strict identifier validation for supported providers
  if (video.provider === "youtube") {
    // Standard YouTube 11-char alphanumeric + - _
    const isValid = /^[a-zA-Z0-9_-]{11}$/.test(video.videoId);
    if (!isValid) return null;

    const safeId = encodeURIComponent(video.videoId);
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${safeId}`,
      watchUrl: `https://www.youtube.com/watch?v=${safeId}`,
      title: video.title || "Instructional Video Demonstration",
    };
  }

  if (video.provider === "vimeo") {
    // Numeric Vimeo video ID
    const isValid = /^[0-9]{6,12}$/.test(video.videoId);
    if (!isValid) return null;

    const safeId = encodeURIComponent(video.videoId);
    return {
      provider: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${safeId}?dnt=1`,
      watchUrl: `https://vimeo.com/${safeId}`,
      title: video.title || "Instructional Video Demonstration",
    };
  }

  return null;
}

/**
 * Resolves a public preview lesson ensuring strict 4-point access control:
 * 1. Parent course is published.
 * 2. Parent module is published.
 * 3. Lesson itself is published.
 * 4. Lesson is designated as preview-eligible (isPreview === true).
 * Returns null if any condition fails.
 */
export function getPreviewLesson(
  courseSlug: string,
  lessonSlug: string,
): { course: Course; module: CourseModule; lesson: Lesson } | null {
  const resolved = getLessonBySlug(courseSlug, lessonSlug);
  if (!resolved || !resolved.lesson.isPreview) {
    return null;
  }
  return resolved;
}

export interface AdjacentPreviewLessons {
  prev: PreviewLessonItem | null;
  next: PreviewLessonItem | null;
}

/**
 * Resolves adjacent preview lessons for public reader navigation.
 * Guarantees that returned previous/next destinations are strictly published preview lessons.
 */
export function getAdjacentPreviewLessons(
  courseSlug: string,
  lessonSlug: string,
): AdjacentPreviewLessons {
  const allPreviews = getPreviewLessons();
  const currentIndex = allPreviews.findIndex(
    (item) => item.courseSlug === courseSlug && item.lesson.slug === lessonSlug,
  );

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? allPreviews[currentIndex - 1] : null,
    next: currentIndex < allPreviews.length - 1 ? allPreviews[currentIndex + 1] : null,
  };
}
