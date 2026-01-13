"use client";

import { useState, useEffect } from "react";
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
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Google } from "../Icons";
import { Spinner } from "../ui/spinner";

interface GoogleAccountSectionProps {
  onConnectionChange: (connected: boolean) => void;
}

export function GoogleAccountSection({
  onConnectionChange,
}: GoogleAccountSectionProps) {
  const { user } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      const googleAccount = user.externalAccounts?.find(
        (account) => account.provider === "google"
      );
      const connected = !!googleAccount;
      setIsConnected(connected);
      setGoogleEmail(googleAccount?.emailAddress || "");
      onConnectionChange(connected);
    }
  }, [user, onConnectionChange]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await user?.createExternalAccount({
        strategy: "oauth_google",
        redirectUrl: window.location.href,
      });
    } catch (error) {
      console.error("Error connecting Google:", error);
      toast.error("Failed to connect Google account");
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);
    try {
      // Verify password before disconnection
      await user?.updatePassword({
        currentPassword: password,
        newPassword: password,
      });

      // If password is correct, proceed with disconnection
      const googleAccount = user?.externalAccounts?.find(
        (account) => account.provider === "google"
      );
      if (googleAccount) {
        await googleAccount.destroy();

        // Refresh the user session to prevent "additional verification" errors
        await user?.reload();

        setIsConnected(false);
        setGoogleEmail("");
        onConnectionChange(false);
        toast.success("Google account disconnected");
        setShowDialog(false);
        setPassword("");
      }
    } catch (error) {
      console.error("Error disconnecting Google:", error);
      toast.error("Failed to disconnect. Please check your password.");
    } finally {
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
      handleDisconnect();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Google className="size-5" />
          Google Account
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect or disconnect your Google account
        </p>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <CheckCircle2 className="size-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Connected</p>
                <p className="text-xs text-muted-foreground">{googleEmail}</p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="size-5 text-muted-foreground" />
              <p className="text-sm font-medium">Not Connected</p>
            </>
          )}
        </div>
        {isConnected ? (
          <Button
            variant="outline"
            onClick={() => setShowDialog(true)}
            disabled={isLoading}
          >
            {isLoading ? <Spinner className="size-5" /> : "Disconnect"}
          </Button>
        ) : (
          <Button onClick={handleConnect} disabled={isLoading}>
            {isLoading ? <Spinner className="size-5" /> : "Connect"}
          </Button>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect Google Account</DialogTitle>
            <DialogDescription>
              Enter your password to disconnect your Google account. If you
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
              onClick={handleDisconnect}
              disabled={isLoading || !password}
            >
              {isLoading ? <Spinner className="size-4" /> : "Disconnect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
