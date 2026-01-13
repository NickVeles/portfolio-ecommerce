"use client";

import { useState, useEffect } from "react";
import { useSession, useUser } from "@clerk/nextjs";
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
  const { session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
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
    if (!password) {
      toast.error("Please enter your password");
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

      // Create an external account connection
      const externalAccount = await user?.createExternalAccount({
        strategy: "oauth_google",
        redirectUrl: "/settings",
      });

      // Redirect to Google's OAuth flow
      const url =
        externalAccount?.verification?.externalVerificationRedirectURL;
      if (url) {
        window.location.replace(url);
      }
    } catch (error) {
      console.error("Failed to connect Google:", error);
      toast.error("Failed to connect. Please check your password.");
    } finally {
      setIsLoading(false);
      setShowConnectDialog(false);
      setPassword("");
    }
  };

  const handleDisconnect = async () => {
    if (!password) {
      toast.error("Please enter your password");
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

      // Find connection and delete
      const googleAccount = user?.externalAccounts?.find(
        (account) => account.provider === "google"
      );
      if (googleAccount) {
        await googleAccount.destroy();
        setIsConnected(false);
        setGoogleEmail("");
        onConnectionChange(false);
        toast.success("Google account disconnected");
        setShowDisconnectDialog(false);
        setPassword("");
      }
    } catch (error) {
      console.error("Error disconnecting Google:", error);
      toast.error("Failed to disconnect. Please check your password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelConnect = () => {
    setShowConnectDialog(false);
    setPassword("");
  };

  const handleCancelDisconnect = () => {
    setShowDisconnectDialog(false);
    setPassword("");
  };

  const handleKeyDownConnect = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && password) {
      e.preventDefault();
      handleConnect();
    }
  };

  const handleKeyDownDisconnect = (e: React.KeyboardEvent) => {
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
              <CheckCircle2 className="size-5 text-primary" />
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
            onClick={() => setShowDisconnectDialog(true)}
            disabled={isLoading}
          >
            {isLoading ? <Spinner className="size-5" /> : "Disconnect"}
          </Button>
        ) : (
          <Button onClick={() => setShowConnectDialog(true)} disabled={isLoading}>
            {isLoading ? <Spinner className="size-5" /> : "Connect"}
          </Button>
        )}
      </div>

      <Dialog
        open={showConnectDialog}
        onOpenChange={(value) => {
          setShowConnectDialog(value);
          setPassword("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Google Account</DialogTitle>
            <DialogDescription>
              Enter your password to verify your identity before connecting your Google account. If you
              don't have a password, set it in the password section first.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="connect-password">Password</Label>
              <Input
                id="connect-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDownConnect}
                placeholder="Enter your password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelConnect}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={isLoading || !password}
            >
              {isLoading ? <Spinner className="size-4" /> : "Connect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDisconnectDialog}
        onOpenChange={(value) => {
          setShowDisconnectDialog(value);
          setPassword("");
        }}
      >
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
              <Label htmlFor="disconnect-password">Password</Label>
              <Input
                id="disconnect-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDownDisconnect}
                placeholder="Enter your password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelDisconnect}
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
