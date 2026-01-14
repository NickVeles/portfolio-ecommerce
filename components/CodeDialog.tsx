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
}

export default function CodeDialog({
  open,
  onOpenChange,
  onSubmit,
  title = "Enter Verification Code",
  description = "Please enter the OTP code sent to your email",
  submitButtonText = "Verify",
  submitButtonVariant = "default",
  isLoading = false,
  codeLength = 6,
}: CodeDialogProps) {
  const [code, setCode] = useState("");

  const handleSubmit = async () => {
    if (code.trim()) {
      await onSubmit(code);
    }
  };

  const handleCancel = () => {
    setCode("");
    onOpenChange(false);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setCode("");
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <InputOTP
            maxLength={codeLength}
            value={code}
            onChange={(value) => setCode(value)}
          >
            <InputOTPGroup>
              {Array.from({ length: codeLength }).map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={submitButtonVariant}
            onClick={handleSubmit}
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? <Spinner className="size-4" /> : submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
