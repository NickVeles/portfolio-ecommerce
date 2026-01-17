"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { handleClerkError } from "@/lib/clerk";
import {
  ReverificationDialog,
  useReverificationDialog,
} from "../ReverificationDialog";
import { useCartStore } from "@/store/cart-store";
import { CONFIRMATION_TEXT_DELETE_ACCOUNT } from "@/lib/constants";

export function DeleteAccountSection() {
  const { user } = useUser();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearLocalCart);
  const [showDialog, setShowDialog] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const deleteAccount = async () => {
    if (!user) {
      throw new Error("User not available");
    }
    await user.delete();
  };

  const { execute, dialogProps } = useReverificationDialog({
    action: deleteAccount,
    onSuccess: () => {
      toast.success("Account deleted successfully");

      // Empty cart
      clearCart();

      // Go to Home
      router.push("/");
    },
    onError: (error) => {
      toast.error("Failed to delete account");
      console.error(error);
    },
    onCancel: () => {
      toast.info("Account deletion cancelled");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (confirmationInput !== CONFIRMATION_TEXT_DELETE_ACCOUNT) {
      toast.error(`Please type ${CONFIRMATION_TEXT_DELETE_ACCOUNT} to confirm`);
      return;
    }

    setIsLoading(true);
    try {
      await execute();
      setShowDialog(false);
    } catch (error) {
      handleClerkError(error, "Failed to delete account.");
    } finally {
      setIsLoading(false);
      setConfirmationInput("");
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setConfirmationInput("");
  };

  return (
    <>
      <div className="p-4 border border-destructive rounded-lg bg-destructive/5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-destructive inline-flex items-center gap-1">
            <AlertTriangle className="size-4" /> Delete Account
          </p>
          <p className="text-xs text-muted-foreground">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button
            variant="destructive"
            onClick={() => setShowDialog(true)}
            className="mt-2"
          >
            Delete My Account
          </Button>
        </div>
      </div>

      <Dialog
        open={showDialog}
        onOpenChange={(value) => {
          setShowDialog(value);
          setConfirmationInput("");
        }}
      >
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-destructive">
                Delete Account
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. Type{" "}
                <span className="font-mono font-semibold">
                  {CONFIRMATION_TEXT_DELETE_ACCOUNT}
                </span>{" "}
                to permanently delete your account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="confirmationInput">Confirmation</Label>
                <Input
                  id="confirmationInput"
                  type="text"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder={`Type ${CONFIRMATION_TEXT_DELETE_ACCOUNT} to confirm`}
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
              <Button
                type="submit"
                variant="destructive"
                disabled={isLoading || confirmationInput !== CONFIRMATION_TEXT_DELETE_ACCOUNT}
              >
                {isLoading ? <Spinner className="size-4" /> : "Delete Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ReverificationDialog {...dialogProps} />
    </>
  );
}
