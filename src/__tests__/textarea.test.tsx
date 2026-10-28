import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Textarea } from "@/components/ui/textarea";

describe("Textarea Primitive Component", () => {
  it("renders with accessible label binding", () => {
    render(<Textarea label="Bio & Swimming Experience" rows={5} />);
    const textarea = screen.getByLabelText(/bio & swimming experience/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("rows", "5");
  });

  it("handles error state with aria-invalid and alert role", () => {
    render(<Textarea label="Feedback" error="Feedback message cannot be left blank" />);
    const textarea = screen.getByLabelText(/feedback/i);
    expect(textarea).toHaveAttribute("aria-invalid", "true");

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Feedback message cannot be left blank");
    expect(textarea).toHaveAttribute("aria-describedby", expect.stringContaining(alert.id));
  });

  it("preserves caller-supplied aria-invalid even without error prop", () => {
    render(<Textarea label="Incident Report" aria-invalid="true" />);
    const textarea = screen.getByLabelText(/incident report/i);
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("prioritizes active validation error over conflicting aria-invalid={false}", () => {
    render(<Textarea label="Notes" error="Notes are required" aria-invalid={false} />);
    const textarea = screen.getByLabelText(/notes/i);
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("renders both error and helperText with non-orphaned aria-describedby references", () => {
    render(
      <Textarea
        label="Message"
        error="Message is required"
        helperText="Max 500 characters allowed"
      />,
    );
    const textarea = screen.getByLabelText(/message/i);
    const alert = screen.getByRole("alert");
    const helper = screen.getByText(/max 500 characters allowed/i);

    expect(alert).toBeInTheDocument();
    expect(helper).toBeInTheDocument();

    const describedBy = textarea.getAttribute("aria-describedby");
    expect(describedBy).toContain(alert.id);
    expect(describedBy).toContain(helper.id);
  });

  it("preserves specific aria-invalid values such as 'grammar'", () => {
    render(<Textarea label="Essay" aria-invalid="grammar" />);
    const textarea = screen.getByLabelText(/essay/i);
    expect(textarea).toHaveAttribute("aria-invalid", "grammar");
  });
});
