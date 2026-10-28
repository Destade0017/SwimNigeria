import { describe, expect, it } from "vitest";
import { APP_CONFIG, BRAND_COLORS, getAppIdentity } from "@/lib/constants";

describe("Application Constants & Identity Baseline", () => {
  it("defines expected application configuration", () => {
    expect(APP_CONFIG.name).toBe("SwimNigeria");
    expect(APP_CONFIG.status).toBe("OPERATIONAL");
    expect(APP_CONFIG.phase).toContain("Phase 1");
  });

  it("exports official SwimNigeria brand color values", () => {
    expect(BRAND_COLORS.primary).toBe("#DC2626");
    expect(BRAND_COLORS.canvas).toBe("#FFFFFF");
    expect(BRAND_COLORS.textPrimary).toBe("#0F172A");
  });

  it("computes application identity string correctly", () => {
    const identity = getAppIdentity();
    expect(identity).toBe("SwimNigeria — Water Safety & Swimming Education Platform");
  });
});
