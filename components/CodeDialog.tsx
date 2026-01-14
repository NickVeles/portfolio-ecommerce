import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";

interface CodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (code: string) => void | Promise<void>;
  onResend?: () => void | Promise<void>;
  title?: string;
  description?: string;
  submitButtonText?: string;
  submitButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  isLoading?: boolean;
  codeLength?: number;
  resendCooldown?: number;
}

export default function CodeDialog({
  open,
  onOpenChange,
  onSubmit,
  onResend,
  title = "Enter Verification Code",
  description = "Please enter the OTP code sent to your email",
  submitButtonText = "Verify",
  submitButtonVariant = "default",
  isLoading = false,
  codeLength = 6,
  resendCooldown = 0,
}: CodeDialogProps) {
  const [code, setCode] = useState("");
  const canResend = resendCooldown === 0 && !isLoading;

  const handleSubmit = async () => {
    if (code.trim()) {
      await onSubmit(code);
    }
  };

  const handleCancel = () => {
    setCode("");
    onOpenChange(false);
  };

  const handleResend = async () => {
    setCode("");
    await onResend?.();
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setCode("");
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <InputOTP
            maxLength={codeLength}
            value={code}
            onChange={(value) => setCode(value)}
            disabled={isLoading}
            onComplete={handleSubmit}
          >
            <InputOTPGroup className="*:text-xl *:size-10 *:sm:size-12">
              {Array.from({ length: codeLength }).map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {onResend && (
            <Button
              variant="link"
              size="sm"
              onClick={handleResend}
              disabled={!canResend}
              className="text-muted-foreground hover:text-secondary"
            >
              {`Didn't receive a code? Resend${
                resendCooldown > 0 ? ` (${resendCooldown})` : ""
              }`}
            </Button>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={submitButtonVariant}
            onClick={handleSubmit}
            disabled={isLoading || code.length !== codeLength}
          >
            {isLoading && <Spinner className="size-4 mr-2" />}
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
