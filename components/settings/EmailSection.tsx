"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EmailSectionProps {
  isGoogleConnected: boolean;
}

export function EmailSection({ isGoogleConnected }: EmailSectionProps) {
  const { user } = useUser();
  const [email, setEmail] = useState(
    user?.emailAddresses[0]?.emailAddress || ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await user?.createEmailAddress({ email: email.trim() });
      toast.success(
        "Verification email sent. Please check your inbox to verify your new email."
      );
      setIsEditing(false);

      if (isGoogleConnected) {
        toast.info(
          "Changing your email will disconnect your Google account. You can reconnect it after verification."
        );
      }
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEmail(user?.emailAddresses[0]?.emailAddress || "");
    setIsEditing(false);
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

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="flex gap-2">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
            placeholder="email@example.com"
          />
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button onClick={handleUpdate} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
        {isGoogleConnected && isEditing && (
          <p className="text-xs text-amber-600">
            Changing your email will disconnect your Google account
          </p>
        )}
      </div>
    </div>
  );
}
