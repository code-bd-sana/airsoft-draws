import React from "react";
import SettingsManager from "../../../components/dashboard/shared/settings/SettingsManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Dashboard",
  description: "Manage your profile, security, and notification settings.",
};

export default function SharedSettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      <div>
        <h1 className="font-heading font-bold text-2xl text-[#E8EDD4] mb-2">Account Settings</h1>
        <p className="font-sans text-sm text-[#72943A]">
          Manage your personal information, security preferences, and account settings.
        </p>
      </div>
      
      <SettingsManager />
    </div>
  );
}
