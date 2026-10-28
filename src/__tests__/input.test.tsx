import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "@/components/ui/input";

describe("Input Primitive Component", () => {
  it("renders with accessible label binding", () => {
    render(<Input label="Full Name" placeholder="e.g. Amina Bello" />);
    const input = screen.getByLabelText(/full name/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("placeholder", "e.g. Amina Bello");
  });

  it("indicates required state in label", () => {
    render(<Input label="Email Address" required />);
    const input = screen.getByLabelText(/email address/i);
    expect(input).toBeRequired();
  });

  it("honors caller-supplied explicit id", () => {
    render(<Input id="custom-user-id" label="Username" />);
    const input = screen.getByLabelText(/username/i);
    expect(input).toHaveAttribute("id", "custom-user-id");
    const label = screen.getByText(/username/i).closest("label");
    expect(label).toHaveAttribute("for", "custom-user-id");
  });

  it("generates unique ids for multiple inputs on the same page", () => {
    render(
      <div>
        <Input label="First Name" />
        <Input label="Last Name" />
      </div>,
    );

    const firstInput = screen.getByLabelText(/first name/i);
    const secondInput = screen.getByLabelText(/last name/i);
    expect(firstInput.id).not.toBe(secondInput.id);
  });

  it("associates error message with role='alert' and aria-invalid", () => {
    render(
      <Input label="Password" type="password" error="Password must be at least 8 characters" />,
    );

    const input = screen.getByLabelText(/password/i);
    expect(input).toHaveAttribute("aria-invalid", "true");

    const errorAlert = screen.getByRole("alert");
    expect(errorAlert).toHaveTextContent("Password must be at least 8 characters");
    expect(input).toHaveAttribute("aria-describedby", expect.stringContaining(errorAlert.id));
  });

  it("preserves caller-supplied aria-invalid even without error prop", () => {
    render(<Input label="Account Number" aria-invalid="true" />);
    const input = screen.getByLabelText(/account number/i);
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("associates helperText via aria-describedby", () => {
    render(<Input label="Phone Number" helperText="Include Nigerian country code (+234)" />);

    const input = screen.getByLabelText(/phone number/i);
    const helper = screen.getByText(/include nigerian country code/i);
    expect(input).toHaveAttribute("aria-describedby", helper.id);
  });

  it("allows user typing and value updates", () => {
    render(<Input label="City" />);
    const input = screen.getByLabelText(/city/i) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Lagos" } });
    expect(input.value).toBe("Lagos");
  });

  it("supports disabled state", () => {
    render(<Input label="Locked Field" disabled />);
    const input = screen.getByLabelText(/locked field/i);
    expect(input).toBeDisabled();
  });
});
