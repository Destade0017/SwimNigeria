import { describe, expect, it } from "vitest";

import * as forgotPasswordActions from "@/app/forgot-password/actions";
import * as loginActions from "@/app/login/actions";
import * as registerActions from "@/app/register/actions";

/**
 * Regression guard for the HTTP 500 caused by non-function exports inside `"use server"`
 * modules. Next.js rejects such modules with:
 * `A "use server" file can only export async functions, found object.`
 *
 * Consequently, result types and initial `useActionState` snapshots live in the ordinary
 * module `src/lib/auth/form-state.ts`, and each `actions.ts` file below must export async
 * functions exclusively.
 */
function listNonAsyncExports(actionsModule: object): string[] {
  return Object.entries(actionsModule)
    .filter(
      ([, value]) => typeof value !== "function" || value.constructor.name !== "AsyncFunction",
    )
    .map(([name, value]) => `${name} (${typeof value})`);
}

describe('"use server" module export contract', () => {
  it("src/app/login/actions.ts exports async functions only", () => {
    expect(Object.keys(loginActions).length).toBeGreaterThan(0);
    expect(listNonAsyncExports(loginActions)).toEqual([]);
    expect(Object.keys(loginActions)).not.toContain("INITIAL_LOGIN_STATE");
  });

  it("src/app/register/actions.ts exports async functions only", () => {
    expect(Object.keys(registerActions).length).toBeGreaterThan(0);
    expect(listNonAsyncExports(registerActions)).toEqual([]);
    expect(Object.keys(registerActions)).not.toContain("INITIAL_REGISTER_STATE");
  });

  it("src/app/forgot-password/actions.ts exports async functions only", () => {
    expect(Object.keys(forgotPasswordActions).length).toBeGreaterThan(0);
    expect(listNonAsyncExports(forgotPasswordActions)).toEqual([]);
    expect(Object.keys(forgotPasswordActions)).not.toContain("INITIAL_FORGOT_PASSWORD_STATE");
    expect(Object.keys(forgotPasswordActions)).not.toContain("INITIAL_RESET_PASSWORD_STATE");
  });
});
