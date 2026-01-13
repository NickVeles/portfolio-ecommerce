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
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function PasswordSection() {
  const { user } = useUser();
  const [showDialog, setShowDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has a password set (users who signed up with OAuth may not have one)
  const hasPassword = user?.passwordEnabled ?? false;

  const handlePasswordChange = async () => {
    // Validate required fields based on whether user has existing password
    if (hasPassword && !currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("New password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      if (hasPassword) {
        // Update existing password
        await user?.updatePassword({
          currentPassword,
          newPassword,
          signOutOfOtherSessions: true,
        });
      } else {
        // Set password for the first time
        await user?.updatePassword({
          newPassword,
          signOutOfOtherSessions: true,
        });
      }

      // Refresh the user session to prevent "additional verification" errors
      await user?.reload();

      toast.success(
        hasPassword ? "Password updated successfully" : "Password set successfully"
      );
      setShowDialog(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(
        hasPassword
          ? "Failed to update password. Check your current password."
          : "Failed to set password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      handlePasswordChange();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Lock className="size-5" />
          Password
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {hasPassword
            ? "Change your account password"
            : "Set a password for your account"}
        </p>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <p className="text-sm font-medium">Password</p>
          <p className="text-xs text-muted-foreground">
            {hasPassword ? "••••••••••••" : "No password set"}
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowDialog(true)}>
          {hasPassword ? "Change Password" : "Set Password"}
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {hasPassword ? "Change Password" : "Set Password"}
            </DialogTitle>
            <DialogDescription>
              {hasPassword
                ? "You will be signed out of all other devices."
                : "Set a password to enable password-based login."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {hasPassword && (
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter current password"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="newPassword">
                {hasPassword ? "New Password" : "Password"}
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={hasPassword ? "Enter new password" : "Enter password"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {hasPassword ? "Confirm New Password" : "Confirm Password"}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  hasPassword ? "Confirm new password" : "Confirm password"
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handlePasswordChange} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : hasPassword ? (
                "Update Password"
              ) : (
                "Set Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
