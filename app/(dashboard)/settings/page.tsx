"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { PersonalInformationSection } from "@/components/settings/PersonalInformationSection";
import { EmailSection } from "@/components/settings/EmailSection";
import { GoogleAccountSection } from "@/components/settings/GoogleAccountSection";
import { PasswordSection } from "@/components/settings/PasswordSection";
import { DeleteAccountSection } from "@/components/settings/DeleteAccountSection";

export default function Settings() {
  const { isLoaded } = useUser();
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold">Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account information and preferences
        </p>
      </div>
      <PersonalInformationSection />
      <EmailSection isGoogleConnected={isGoogleConnected} />
      <GoogleAccountSection onConnectionChange={setIsGoogleConnected} />
      <PasswordSection />
      <DeleteAccountSection />
    </div>
  );
}
