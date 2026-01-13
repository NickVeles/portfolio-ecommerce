"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
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
    setIsLoading(true);
    try {
      const googleAccount = user?.externalAccounts?.find(
        (account) => account.provider === "google"
      );
      if (googleAccount) {
        await googleAccount.destroy();
        setIsConnected(false);
        setGoogleEmail("");
        onConnectionChange(false);
        toast.success("Google account disconnected");
      }
    } catch (error) {
      console.error("Error disconnecting Google:", error);
      toast.error("Failed to disconnect Google account");
    } finally {
      setIsLoading(false);
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
              <div>
                <p className="text-sm font-medium">Not Connected</p>
                <p className="text-xs text-muted-foreground">
                  Connect your Google account for easier sign-in
                </p>
              </div>
            </>
          )}
        </div>
        {isConnected ? (
          <Button
            variant="outline"
            onClick={handleDisconnect}
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
    </div>
  );
}
