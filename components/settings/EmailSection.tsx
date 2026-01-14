"use client";

import { useEffect, useState } from "react";
import { useUser, useSession } from "@clerk/nextjs";
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
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import CodeDialog from "../CodeDialog";
import { EmailAddressResource } from "@clerk/types";

export function EmailSection() {
  const { user } = useUser();
  const { session } = useSession();
  const [showEmailChangeDialog, setShowEmailChangeDialog] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [newEmailObject, setNewEmailObject] =
    useState<EmailAddressResource | null>(null);
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentEmail = user?.emailAddresses[0]?.emailAddress || "";
  const isNewEmailVerified =
    user?.emailAddresses[0]?.verification?.status === "verified";
  const isNewEmailPrimary =
    user?.emailAddresses[0]?.id === user?.primaryEmailAddress?.id;
  const hasPassword = user?.passwordEnabled ?? false;

  const handleEmailChange = async () => {
    // Validate password if user has one
    if (hasPassword && !password) {
      toast.error("Password is required");
      return;
    }

    if (!newEmail.trim() || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (newEmail !== confirmEmail) {
      toast.error("Email addresses do not match");
      return;
    }

    if (newEmail === currentEmail) {
      toast.error("New email must be different from current email");
      return;
    }

    setIsLoading(true);
    try {
      // Verify user through password
      await session?.startVerification({ level: "first_factor" });
      await session?.attemptFirstFactorVerification({
        strategy: "password",
        password,
      });

      // Create new email address
      const res = await user?.createEmailAddress({ email: newEmail.trim() });

      // Send verification
      res?.prepareVerification({
        strategy: "email_code",
      });

      setNewEmailObject(res!);

      toast.success(
        "Verification email sent. Please check your inbox to verify your new email."
      );

      setShowEmailChangeDialog(false);
      setShowCodeDialog(true);
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email. Check your password and try again.");
      setIsLoading(false);
    } finally {
      setPassword("");
      setNewEmail("");
      setConfirmEmail("");
    }
  };

  const handleReverify = async () => {
    try {
      const res = user?.emailAddresses[0]!;

      // Send verification
      res?.prepareVerification({
        strategy: "email_code",
      });

      setNewEmailObject(res!);

      toast.success(
        "Verification email sent. Please check your inbox to verify your new email."
      );

      setShowCodeDialog(true);
    } catch (error) {
      console.error("Error sending verification:", error);
      toast.error("Failed to send verification.");
    }
  };

  const handleVerify = async (code: string) => {
    try {
      // Verify through code
      await newEmailObject?.attemptVerification({ code });

      // Set new primary email
      user?.update({ primaryEmailAddressId: newEmailObject!.id });

      // Reload the user
      await user?.reload();

      // Delete all other emails
      user?.emailAddresses
        .filter((e) => e.id !== newEmailObject!.id)
        .map(async (e) => {
          await e.destroy();
        });
    } catch (error) {
      console.error("Error updating primary email:", error);
      toast.error("Fail to verify the email.");
    } finally {
      setIsLoading(false);
      setShowCodeDialog(false);
    }
  };

  const handleCancel = async () => {
    setShowEmailChangeDialog(false);
    setShowCodeDialog(false);
    setPassword("");
    setNewEmail("");
    setConfirmEmail("");
    setIsLoading(false);

    try {
      // Delete all non-primary emails
      user?.emailAddresses
        .filter((e) => e.id !== user.primaryEmailAddress?.id)
        .map(async (e) => {
          await e.destroy();
        });
    } catch (error) {
      console.error("Error handling cancel event:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      handleEmailChange();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Mail className="size-5" />
          Email Address
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your email address for this account
        </p>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <p className="text-sm font-medium">Email</p>
          <p className="text-xs text-muted-foreground">{currentEmail}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowEmailChangeDialog(true)}
        >
          Change Email
        </Button>
      </div>

      {isNewEmailVerified && !isNewEmailPrimary && (
        <Button variant="link" onClick={() => handleReverify}>
          Complete Verification
        </Button>
      )}

      <Dialog
        open={showEmailChangeDialog}
        onOpenChange={setShowEmailChangeDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
            <DialogDescription>
              You will receive a verification email at your new address. If you
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
            <div className="space-y-2">
              <Label htmlFor="newEmail">New Email</Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter new email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmEmail">Confirm New Email</Label>
              <Input
                id="confirmEmail"
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Confirm new email"
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
            <Button onClick={handleEmailChange} disabled={isLoading}>
              {isLoading ? <Spinner className="size-4" /> : "Update Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CodeDialog
        open={showCodeDialog}
        onOpenChange={handleCancel}
        onSubmit={handleVerify}
      />
    </div>
  );
}
