import { chromium } from "@playwright/test";

const BASE = "http://localhost:3001";
const shots = [
  { name: "art-fear-lake", path: "/articles/overcoming-fear-of-water-adult-beginners" },
  { name: "art-families-kids", path: "/articles/water-safety-rules-nigerian-families" },
  { name: "course-buoyancy-cover", path: "/courses/buoyancy-breathing-mechanics" },
  { name: "course-freestyle-cover", path: "/courses/beginner-freestyle-propulsion" },
  { name: "lesson-drag-figure", path: "/courses/beginner-freestyle-propulsion/lessons/hydrodynamic-drag-and-body-line" },
];

const browser = await chromium.launch();
const problems = [];
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  page.on("console", (m) => m.type() === "error" && problems.push(`${s.name}: ${m.text()}`));
  await page.goto(BASE + s.path, { waitUntil: "networkidle" });
  const fig = page.locator("figure").first();
  if ((await fig.count()) === 0) {
    problems.push(`${s.name}: no <figure> found`);
  } else {
    await fig.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await fig.screenshot({ path: `/tmp/sn-review/${s.name}.png` });
  }
  await page.close();
}
await browser.close();
console.log(problems.length ? problems.join("\n") : "OK: all figures found, no console errors");
