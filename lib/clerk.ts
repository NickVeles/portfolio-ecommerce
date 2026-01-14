import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { toast } from "sonner";

/**
 * Handles Clerk API errors by displaying a toast with the error message.
 * Falls back to a custom message if the error is not a Clerk API error.
 *
 * @param error - The error to handle
 * @param fallbackMessage - Message to show if error is not a Clerk API error
 */
export function handleClerkError(error: unknown, fallbackMessage: string) {
  if (isClerkAPIResponseError(error)) {
    const clerkError = error.errors[0];
    const message =
      clerkError?.longMessage || clerkError?.message || fallbackMessage;
    console.error("Clerk error:", clerkError);
    toast.error(message);
  } else {
    console.error("Error:", error);
    toast.error(fallbackMessage);
  }
}
