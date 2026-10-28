import "@testing-library/jest-dom/vitest";

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
