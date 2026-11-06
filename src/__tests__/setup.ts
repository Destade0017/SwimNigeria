import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

// next/image requires the Next image config context, which is unavailable in jsdom.
// Render a plain <img> preserving src/alt/className so a11y and content assertions hold.
const NEXT_ONLY_IMAGE_PROPS = ["fill", "priority", "sizes", "quality", "placeholder", "loading"];

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt, ...rest } = props;
    const imgProps = Object.fromEntries(
      Object.entries(rest).filter(([key]) => !NEXT_ONLY_IMAGE_PROPS.includes(key)),
    );
    // Omit alt entirely when the caller omitted it, so axe-core flags the missing
    // attribute instead of treating a fabricated alt="" as intentionally decorative.
    return React.createElement("img", {
      src: String(src),
      ...(alt === undefined ? {} : { alt: String(alt) }),
      ...imgProps,
    });
  },
}));

// Mock HTMLDialogElement methods in jsdom test environment if absent
if (typeof window !== "undefined") {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true;
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      this.open = false;
    };
  }
}
