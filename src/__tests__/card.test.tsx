import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

describe("Card Primitive Component", () => {
  it("renders card with compound header, content, and footer", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Beginner Freestyle Fundamentals</CardTitle>
          <CardDescription>4-week structured curriculum</CardDescription>
        </CardHeader>
        <CardContent>Learn body position, breathing rhythm, and flutter kick.</CardContent>
        <CardFooter>
          <button type="button">View Course</button>
        </CardFooter>
      </Card>,
    );

    expect(
      screen.getByRole("heading", {
        name: /beginner freestyle fundamentals/i,
        level: 3,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/4-week structured curriculum/i)).toBeInTheDocument();
    expect(screen.getByText(/learn body position, breathing rhythm/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view course/i })).toBeInTheDocument();
  });

  it("supports customizable heading level on CardTitle", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle as="h2">Section Title</CardTitle>
        </CardHeader>
      </Card>,
    );

    expect(screen.getByRole("heading", { name: /section title/i, level: 2 })).toBeInTheDocument();
  });

  it("applies interactive variant styling", () => {
    const { container } = render(<Card variant="interactive">Interactive Card</Card>);
    expect(container.firstChild).toHaveClass("cursor-pointer");
  });
});
