"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export function DeleteAccountSection() {
  const { user } = useUser();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);
    try {
      // Verify password before deletion
      await user?.updatePassword({
        currentPassword: password,
        newPassword: password,
      });

      // Refresh the user session to prevent "additional verification" errors
      await user?.reload();

      // If password is correct, proceed with deletion
      await user?.delete();
      toast.success("Account deleted successfully");

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please check your password.");
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setPassword("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && password) {
      e.preventDefault();
      handleDelete();
    }
  };

  return (
    <>
      <div className="p-4 border border-destructive rounded-lg bg-destructive/5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-destructive inline-flex items-center gap-1">
            <AlertTriangle className="size-4" /> Delete Account
          </p>
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

      <Dialog
        open={showDialog}
        onOpenChange={(value) => {
          setShowDialog(value);
          setPassword("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Delete Account
            </DialogTitle>
            <DialogDescription>
              Enter your password to permanently delete your account. If you
              don't have a password, set it in the password section first.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading || !password}
            >
              {isLoading ? <Spinner className="size-4" /> : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
