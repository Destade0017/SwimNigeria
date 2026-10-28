import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import axe from "axe-core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

describe("UI Primitives Automated Accessibility Audit (axe-core)", () => {
  it("renders Button variants with zero accessibility violations", async () => {
    const { container } = render(
      <main>
        <h1>Button Suite</h1>
        <Button variant="primary">Primary Action</Button>
        <Button variant="secondary">Secondary Action</Button>
        <Button variant="outline">Outline Action</Button>
        <Button variant="aquatic">Aquatic Action</Button>
        <Button variant="danger">Danger Action</Button>
        <Button size="icon" aria-label="Accessible icon button">
          ✓
        </Button>
      </main>,
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("renders Form Input and Textarea controls with zero accessibility violations", async () => {
    const { container } = render(
      <main>
        <h1>Form Controls</h1>
        <form>
          <Input
            label="Full Legal Name"
            placeholder="Amina Bello"
            required
            helperText="Used on certificates of completion"
          />
          <Input label="Email Address" type="email" error="Please enter a valid email address" />
          <Textarea
            label="Swimming Experience Notes"
            placeholder="Tell us about your comfort level in water…"
          />
        </form>
      </main>,
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("renders Card, Badge, and Skeleton with zero accessibility violations", async () => {
    const { container } = render(
      <main>
        <h1>Course Overview</h1>
        <Card>
          <CardHeader>
            <div className="flex gap-2">
              <Badge variant="brand">Urgent Safety</Badge>
              <Badge variant="aquatic">Beginner</Badge>
            </div>
            <CardTitle as="h2">Water Safety & Survival Swimming</CardTitle>
            <CardDescription>Essential knowledge before practical aquatic lessons.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Learn water awareness, safe entry techniques, and lifejacket inspection.</p>
            <Skeleton className="h-4 w-full mt-2" />
          </CardContent>
          <CardFooter>
            <Button variant="primary">Start Theory Lesson</Button>
          </CardFooter>
        </Card>
      </main>,
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("renders Dialog with zero accessibility violations", async () => {
    const { container } = render(
      <main>
        <h1>Page with Modal</h1>
        <Dialog isOpen={true} onClose={() => {}}>
          <DialogHeader onClose={() => {}}>
            <DialogTitle>Confirm Course Registration</DialogTitle>
            <DialogDescription>Please verify your information before continuing.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button variant="primary">Confirm</Button>
          </DialogFooter>
        </Dialog>
      </main>,
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
