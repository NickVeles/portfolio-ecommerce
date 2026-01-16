"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Google } from "../Icons";
import { Spinner } from "../ui/spinner";
import { handleClerkError } from "@/lib/clerk";
import {
  ReverificationDialog,
  useReverificationDialog,
} from "../ReverificationDialog";

interface GoogleAccountSectionProps {
  onConnectionChange?: (connected: boolean) => void;
}

export function GoogleAccountSection({
  onConnectionChange,
}: GoogleAccountSectionProps = {}) {
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
      onConnectionChange?.(connected);
    }
  }, [user, onConnectionChange]);

  const hasPassword = user?.passwordEnabled ?? false;

  const connectGoogle = async () => {
    const externalAccount = await user?.createExternalAccount({
      strategy: "oauth_google",
      redirectUrl: "/settings",
    });

    const url = externalAccount?.verification?.externalVerificationRedirectURL;
    if (url) {
      window.location.replace(url);
    }
  };

  const disconnectGoogle = async () => {
    const googleAccount = user?.externalAccounts?.find(
      (account) => account.provider === "google"
    );
    if (googleAccount) {
      await googleAccount.destroy();
      setIsConnected(false);
      setGoogleEmail("");
      onConnectionChange?.(false);
    }
  };

  const { execute: executeConnect, dialogProps: connectDialogProps } =
    useReverificationDialog({
      action: connectGoogle,
      onError: (error) => {
        handleClerkError(error, "Failed to connect Google account.");
      },
    });

  const { execute: executeDisconnect, dialogProps: disconnectDialogProps } =
    useReverificationDialog({
      action: disconnectGoogle,
      onSuccess: () => {
        toast.success("Google account disconnected");
      },
      onError: (error) => {
        handleClerkError(error, "Failed to disconnect Google account.");
      },
    });

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await executeConnect();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!hasPassword) {
      toast.error(
        "You must set a password before disconnecting your Google account."
      );
      return;
    }

    setIsLoading(true);
    try {
      await executeDisconnect();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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

      <ReverificationDialog {...connectDialogProps} />
      <ReverificationDialog {...disconnectDialogProps} />
    </>
  );
}
