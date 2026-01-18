"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { toast } from "sonner";
import { handleClerkError } from "@/lib/clerk";
import { Spinner } from "../ui/spinner";

export function PersonalInformationSection() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state when user data loads or changes
  useEffect(() => {
    if (user && !isEditing) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user, isEditing]);

  const handleUpdate = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await user?.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      toast.success("Name updated successfully");
      setIsEditing(false);
    } catch (error) {
      handleClerkError(error, "Failed to update name.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <User className="size-5" />
          Personal Information
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your name and personal details
        </p>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!isEditing}
              placeholder="First name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!isEditing}
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button onClick={handleUpdate} disabled={isLoading}>
                {isLoading ? <Spinner className="size-4" /> : "Save"}
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
      </div>
    </div>
  );
}
