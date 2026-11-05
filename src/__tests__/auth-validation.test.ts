import { describe, it, expect } from "vitest";
import { registerSchema } from "@/lib/validation/auth";

describe("Registration Schema Validation (Zod)", () => {
  const validPayload = {
    fullName: "Amina Bello",
    email: "amina.bello@example.com",
    password: "Password123",
    confirmPassword: "Password123",
  };

  it("successfully parses a valid registration payload", () => {
    const result = registerSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe("Amina Bello");
      expect(result.data.email).toBe("amina.bello@example.com");
      expect(result.data.password).toBe("Password123");
    }
  });

  it("trims leading and trailing whitespace from full name and lowercases email", () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      fullName: "   Tunde Bakare   ",
      email: "  TUNDE@EXAMPLE.COM  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe("Tunde Bakare");
      expect(result.data.email).toBe("tunde@example.com");
    }
  });

  describe("Full Name Validation", () => {
    it("rejects an empty name", () => {
      const result = registerSchema.safeParse({
        ...validPayload,
        fullName: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.fullName).toBeDefined();
      }
    });

    it("rejects whitespace-only name", () => {
      const result = registerSchema.safeParse({
        ...validPayload,
        fullName: "     ",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.fullName).toBeDefined();
      }
    });

    it("rejects a name shorter than 2 characters", () => {
      const result = registerSchema.safeParse({
        ...validPayload,
        fullName: "A",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.fullName?.[0]).toMatch(/at least 2 characters/i);
      }
    });

    it("rejects an excessively long name (> 100 characters)", () => {
      const result = registerSchema.safeParse({
        ...validPayload,
        fullName: "A".repeat(101),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.fullName?.[0]).toMatch(
          /cannot exceed 100 characters/i,
        );
      }
    });
  });

  describe("Email Validation", () => {
    it("rejects an invalid email without domain", () => {
      const result = registerSchema.safeParse({
        ...validPayload,
        email: "plainaddress",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    });

    it("rejects an email missing @ symbol", () => {
      const result = registerSchema.safeParse({
        ...validPayload,
        email: "amina.bello.example.com",
      });
      expect(result.success).toBe(false);
    });

    it("rejects an empty email", () => {
      const result = registerSchema.safeParse({
        ...validPayload,
        email: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Password Complexity & Confirmation Validation", () => {
    it("rejects a password shorter than 8 characters", () => {
      const result = registerSchema.safeParse({
        ...validPayload,
        password: "Pass1",
        confirmPassword: "Pass1",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password?.[0]).toMatch(/at least 8 characters/i);
      }
    });

    it("rejects a password longer than 72 characters", () => {
      const longPass = "P1" + "a".repeat(71);
      const result = registerSchema.safeParse({
        ...validPayload,
        password: longPass,
        confirmPassword: longPass,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password?.[0]).toMatch(
          /cannot exceed 72 characters/i,
        );
      }
    });

    it("rejects a password without any letters", () => {
      const result = registerSchema.safeParse({
        ...validPayload,
        password: "1234567890",
        confirmPassword: "1234567890",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password?.[0]).toMatch(/at least one letter/i);
      }
    });

    it("rejects a password without any numbers", () => {
      const result = registerSchema.safeParse({
        ...validPayload,
        password: "OnlyLettersHere",
        confirmPassword: "OnlyLettersHere",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password?.[0]).toMatch(/at least one number/i);
      }
    });

    it("rejects mismatched password and confirmation", () => {
      const result = registerSchema.safeParse({
        ...validPayload,
        password: "Password123",
        confirmPassword: "Password456",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.confirmPassword?.[0]).toMatch(
          /passwords do not match/i,
        );
      }
    });
  });

  describe("Unexpected Payload Handling", () => {
    it("strips extraneous fields such as roles or administrative claims", () => {
      const payloadWithInjectedClaims = {
        ...validPayload,
        role: "admin",
        isAdmin: true,
        permissions: ["all"],
        is_verified: true,
      };

      const result = registerSchema.safeParse(payloadWithInjectedClaims);
      expect(result.success).toBe(true);
      if (result.success) {
        // Output type should not contain injected fields
        expect((result.data as Record<string, unknown>).role).toBeUndefined();
        expect((result.data as Record<string, unknown>).isAdmin).toBeUndefined();
        expect((result.data as Record<string, unknown>).is_verified).toBeUndefined();
      }
    });
  });
});
