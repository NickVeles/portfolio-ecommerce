"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { EmailAddressResource } from "@clerk/types";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "../ui/spinner";
import CodeDialog from "../CodeDialog";
import {
  ReverificationDialog,
  useReverificationDialog,
} from "../ReverificationDialog";
import { handleClerkError } from "@/lib/clerk";
import { RESEND_COOLDOWN_SECONDS } from "@/lib/constants";

export function EmailSection() {
  const { user } = useUser();
  const [showEmailChangeDialog, setShowEmailChangeDialog] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [newEmailObject, setNewEmailObject] =
    useState<EmailAddressResource | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const currentEmail = user?.primaryEmailAddress?.emailAddress || "";
  const hasGoogleAccount = user?.externalAccounts?.some(
    (account) => account.provider === "google"
  );

  const handleChangeEmailButtonClick = () => {
    if (hasGoogleAccount) {
      toast.error("Disconnect your Google account to change email.");
    } else {
      setShowEmailChangeDialog(true);
    }
  };

  const createEmailAddress = async () => {
    if (!user) {
      throw new Error("User not available");
    }

    // Remove non-primary email addresses
    await Promise.all(
      user.emailAddresses
        .filter((e) => e.id !== user.primaryEmailAddress?.id)
        .map((e) => e.destroy())
    );

    // Create new email
    const res = await user.createEmailAddress({ email: newEmail.trim() });

    if (!res) {
      throw new Error("Failed to create email address");
    }

    // Send verification
    await res.prepareVerification({
      strategy: "email_code",
    });

    setNewEmailObject(res);
    setResendCooldown(RESEND_COOLDOWN_SECONDS);

    toast.success(
      "Verification email sent. Please check your inbox to verify your new email."
    );

    setShowEmailChangeDialog(false);
    setShowCodeDialog(true);
  };

  const handleResendCode = async () => {
    if (!newEmailObject) return;
    try {
      await newEmailObject.prepareVerification({
        strategy: "email_code",
      });
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      toast.success("Verification code resent.");
    } catch (error) {
      handleClerkError(error, "Failed to resend code.");
    }
  };

  const { execute, dialogProps } = useReverificationDialog({
    action: createEmailAddress,
    onSuccess: () => {
      // Success handling is done in createEmailAddress
    },
    onError: (error) => {
      toast.error("Failed to update email");
      console.error(error);
    },
    onCancel: () => {
      toast.info("Email change cancelled");
    },
  });

  const setPrimaryEmail = async () => {
    if (!user || !newEmailObject) {
      throw new Error("User or email address not available");
    }

    // Set new primary email
    await user.update({ primaryEmailAddressId: newEmailObject.id });

    // Reload the user
    await user.reload();

    // Delete non-primary email addresses if present
    await Promise.all(
      user.emailAddresses
        .filter((e) => e.id !== newEmailObject.id)
        .map((e) => e.destroy())
    );
  };

  const { execute: executeSetPrimary, dialogProps: verifyDialogProps } =
    useReverificationDialog({
      action: setPrimaryEmail,
      onSuccess: () => {
        toast.success("Email updated successfully");
        setShowCodeDialog(false);
        setNewEmail("");
      },
      onError: (error) => {
        toast.error("Failed to set primary email");
        console.error(error);
      },
      onCancel: () => {
        toast.info("Email verification cancelled");
      },
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail.trim() || !emailRegex.test(newEmail.trim())) {
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
      await execute();
    } catch (error) {
      handleClerkError(error, "Failed to update email.");
    } finally {
      setIsLoading(false);
      setConfirmEmail("");
    }
  };

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    try {
      // Verify through code
      await newEmailObject?.attemptVerification({ code });

      // Set primary email (may trigger reverification)
      await executeSetPrimary();
    } catch (error) {
      handleClerkError(error, "Failed to verify the email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setShowEmailChangeDialog(false);
    setShowCodeDialog(false);
    setNewEmail("");
    setConfirmEmail("");
    setIsLoading(false);
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
          onClick={handleChangeEmailButtonClick}
        >
          Change Email
        </Button>
      </div>

      <Dialog
        open={showEmailChangeDialog}
        onOpenChange={setShowEmailChangeDialog}
      >
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Change Email</DialogTitle>
              <DialogDescription>
                You will receive a verification email at your new address.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newEmail">New Email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
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
                  placeholder="Confirm new email"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner className="size-4" /> : "Update Email"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ReverificationDialog {...dialogProps} />
      <ReverificationDialog {...verifyDialogProps} />

      <CodeDialog
        open={showCodeDialog}
        onOpenChange={handleCancel}
        onSubmit={handleVerify}
        onResend={handleResendCode}
        resendCooldown={resendCooldown}
        description={`Please enter the OTP code sent to ${newEmail}`}
      />
    </div>
  );
}
