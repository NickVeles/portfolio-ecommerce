"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession, useUser, useReverification } from "@clerk/nextjs";
import { SessionVerificationLevel } from "@clerk/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Spinner } from "./ui/spinner";

const RESEND_COOLDOWN_SECONDS = 45;

interface VerificationState {
  level: SessionVerificationLevel | undefined;
  complete: () => void;
  cancel: () => void;
}

interface UseReverificationDialogOptions<T> {
  action: () => Promise<T>;
  onSuccess?: (result: T) => void;
  onError?: (error: unknown) => void;
  onCancel?: () => void;
}

export function useReverificationDialog<T>({
  action,
  onSuccess,
  onError,
  onCancel,
}: UseReverificationDialogOptions<T>) {
  const { session } = useSession();
  const { user } = useUser();

  const [verificationState, setVerificationState] =
    useState<VerificationState | null>(null);
  const [code, setCode] = useState("");
  const [isPreparing, setIsPreparing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const enhancedAction = useReverification(action, {
    onNeedsReverification: ({ level, complete, cancel }) => {
      setVerificationState({ level, complete, cancel });
      setCode("");
      setError(null);
      startAndPrepareVerification(level);
    },
  });

  const startAndPrepareVerification = async (
    level: SessionVerificationLevel | undefined
  ) => {
    setIsPreparing(true);
    setError(null);
    try {
      const emailId = user?.primaryEmailAddress?.id;
      if (!emailId) throw new Error("No email address found");

      // First, start the verification flow
      await session?.startVerification({ level: level || "first_factor" });

      // Then prepare the specific verification method
      await session?.prepareFirstFactorVerification({
        strategy: "email_code",
        emailAddressId: emailId,
      });
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError("Failed to send verification code. Please try again.");
      console.error(err);
    } finally {
      setIsPreparing(false);
    }
  };

  const resendCode = async () => {
    setIsPreparing(true);
    setError(null);
    try {
      const emailId = user?.primaryEmailAddress?.id;
      if (!emailId) throw new Error("No email address found");

      await session?.prepareFirstFactorVerification({
        strategy: "email_code",
        emailAddressId: emailId,
      });
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError("Failed to resend code. Please try again.");
      console.error(err);
    } finally {
      setIsPreparing(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) return;

    setIsVerifying(true);
    setError(null);
    try {
      await session?.attemptFirstFactorVerification({
        strategy: "email_code",
        code,
      });
      verificationState?.complete();
      setVerificationState(null);
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage || "Invalid code. Please try again.";
      setError(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancel = () => {
    verificationState?.cancel();
    setVerificationState(null);
    setCode("");
    setError(null);
    onCancel?.();
  };

  const handleResend = () => {
    setCode("");
    resendCode();
  };

  const execute = useCallback(async () => {
    try {
      const result = await enhancedAction();
      onSuccess?.(result);
      return result;
    } catch (err) {
      onError?.(err);
      throw err;
    }
  }, [enhancedAction, onSuccess, onError]);

  const dialogProps = {
    open: verificationState !== null,
    code,
    setCode,
    isPreparing,
    isVerifying,
    error,
    onVerify: handleVerify,
    onCancel: handleCancel,
    onResend: handleResend,
    email: user?.primaryEmailAddress?.emailAddress,
    resendCooldown,
  };

  return { execute, dialogProps };
}

interface ReverificationDialogProps {
  open: boolean;
  code: string;
  setCode: (code: string) => void;
  isPreparing: boolean;
  isVerifying: boolean;
  error: string | null;
  onVerify: () => void;
  onCancel: () => void;
  onResend: () => void;
  email?: string;
  resendCooldown: number;
}

export function ReverificationDialog({
  open,
  code,
  setCode,
  isPreparing,
  isVerifying,
  error,
  onVerify,
  onCancel,
  onResend,
  email,
  resendCooldown,
}: ReverificationDialogProps) {
  const isLoading = isPreparing || isVerifying;
  const canResend = resendCooldown === 0 && !isLoading;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify your identity</DialogTitle>
          <DialogDescription>
            {isPreparing ? (
              "Sending verification code..."
            ) : (
              <>
                We sent a code to <span className="font-medium">{email}</span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            disabled={isLoading}
            onComplete={onVerify}
          >
            <InputOTPGroup className="*:text-xl *:size-10 *:sm:size-12">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button
            variant="link"
            size="sm"
            onClick={onResend}
            disabled={!canResend}
            className="text-muted-foreground hover:text-secondary"
          >
            {`Didn't receive a code? Resend${
              resendCooldown > 0 ? ` (${resendCooldown})` : ""
            }`}
          </Button>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onVerify} disabled={code.length !== 6 || isLoading}>
            {isVerifying && <Spinner className="size-4 mr-2" />}
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
