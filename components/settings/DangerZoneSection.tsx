"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DangerZoneSection() {
  const { user } = useUser();
  const [showDialog, setShowDialog] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (confirmation !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setIsLoading(true);
    try {
      await user?.delete();
      toast.success("Account deleted successfully");
      // User will be redirected automatically by Clerk
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setConfirmation("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Permanently delete your account and all associated data
        </p>
      </div>

      <div className="p-4 border border-destructive rounded-lg bg-destructive/5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-destructive">Delete Account</p>
          <p className="text-xs text-muted-foreground">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button
            variant="destructive"
            onClick={() => setShowDialog(true)}
            className="mt-2"
          >
            Delete My Account
          </Button>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deleteConfirmation">
                Type <span className="font-bold">DELETE</span> to confirm
              </Label>
              <Input
                id="deleteConfirmation"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="DELETE"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading || confirmation !== "DELETE"}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Delete Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
