import { chromium } from "@playwright/test";

const routes = [
  ["home", "/"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["articles", "/articles"],
  ["article", "/articles/overcoming-fear-of-water-adult-beginners"],
  ["courses", "/courses"],
  ["syllabus", "/courses/water-safety-overcoming-fear"],
  ["lesson", "/courses/water-safety-overcoming-fear/lessons/fear-as-a-survival-instinct"],
];

const sizes = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 375, height: 800 },
];

const browser = await chromium.launch();
for (const size of sizes) {
  const page = await browser.newPage({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: 2,
  });
  for (const [label, path] of routes) {
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`http://localhost:3001${path}`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: `/tmp/sn-shots/${size.name}-${label}.png`,
      fullPage: true,
    });
    if (errors.length) console.log(`CONSOLE ${label} (${size.name}):`, errors.slice(0, 3));
  }
  await page.close();
}
await browser.close();
console.log("done");
