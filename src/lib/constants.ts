export const APP_CONFIG = {
  name: "SwimNigeria",
  shortDescription: "Water Safety & Swimming Education Platform",
  status: "OPERATIONAL",
  phase: "Phase 1: Technology Scaffolding",
} as const;

export const BRAND_COLORS = {
  primary: "#DC2626", // brand-red-600
  primaryHover: "#B91C1C", // brand-red-700
  canvas: "#FFFFFF", // neutral-white
  surfaceMuted: "#F8FAFC", // neutral-50
  textPrimary: "#0F172A", // neutral-900
  textSecondary: "#475569", // neutral-600
} as const;

export function getAppIdentity(): string {
  return `${APP_CONFIG.name} — ${APP_CONFIG.shortDescription}`;
}
