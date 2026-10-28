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

  it("allows user input typing", () => {
    render(<Textarea label="Notes" />);
    const textarea = screen.getByLabelText(/notes/i) as HTMLTextAreaElement;

    fireEvent.change(textarea, {
      target: { value: "Practiced freestyle kick." },
    });
    expect(textarea.value).toBe("Practiced freestyle kick.");
  });
});
