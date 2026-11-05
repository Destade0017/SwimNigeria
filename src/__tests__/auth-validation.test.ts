import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth";

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

describe("Login Schema Validation (Zod)", () => {
  const validLogin = {
    email: "amina.bello@example.com",
    password: "Password123",
  };

  it("successfully parses valid login payload", () => {
    const result = loginSchema.safeParse(validLogin);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("amina.bello@example.com");
      expect(result.data.password).toBe("Password123");
    }
  });

  it("trims and normalizes email address to lowercase", () => {
    const result = loginSchema.safeParse({
      email: "  AMINA@EXAMPLE.COM  ",
      password: "Password123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("amina@example.com");
    }
  });

  it("rejects missing email", () => {
    const result = loginSchema.safeParse({
      password: "Password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email format", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "Password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing or empty password", () => {
    const result = loginSchema.safeParse({
      email: "amina@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("strips malicious injected payload fields (roles, metadata)", () => {
    const result = loginSchema.safeParse({
      ...validLogin,
      role: "admin",
      user_metadata: { role: "admin" },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect((result.data as Record<string, unknown>).role).toBeUndefined();
      expect((result.data as Record<string, unknown>).user_metadata).toBeUndefined();
    }
  });
});

describe("Forgot Password Schema Validation (Zod)", () => {
  it("validates correct email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "learner@example.com",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("learner@example.com");
    }
  });

  it("normalizes email to lowercase and trims whitespace", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "  LEARNER@EXAMPLE.COM  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("learner@example.com");
    }
  });

  it("rejects invalid email address", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = forgotPasswordSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("Reset Password Schema Validation (Zod)", () => {
  it("validates valid password and confirmation", () => {
    const result = resetPasswordSchema.safeParse({
      password: "StrongPassword123",
      confirmPassword: "StrongPassword123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.password).toBe("StrongPassword123");
    }
  });

  it("rejects password shorter than 8 characters", () => {
    const result = resetPasswordSchema.safeParse({
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password?.[0]).toMatch(/at least 8 characters/i);
    }
  });

  it("rejects password mismatch", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Password123",
      confirmPassword: "DifferentPassword123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword?.[0]).toMatch(
        /passwords do not match/i,
      );
    }
  });

  it("rejects missing fields", () => {
    const result = resetPasswordSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
