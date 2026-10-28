"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function TestDialogPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Dialog Harness</h1>
      <Button id="open-dialog-btn" onClick={() => setIsOpen(true)}>
        Open Test Dialog
      </Button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DialogHeader>
          <DialogTitle>Enrollment Confirmation</DialogTitle>
          <DialogDescription>
            Confirm your enrollment in SwimNigeria Water Safety.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <p>Dialog body content</p>
        </div>
        <DialogFooter>
          <Button id="cancel-dialog-btn" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button id="confirm-dialog-btn" onClick={() => setIsOpen(false)}>
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </main>
  );
}
