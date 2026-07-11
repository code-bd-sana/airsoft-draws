import React from "react";
import { Metadata } from "next";
import HostAuthLayout from "../../../components/host-auth/HostAuthLayout";
import HostLoginForm from "../../../components/host-auth/HostLoginForm";

export const metadata: Metadata = {
  title: "Host Login | Airsoft Draws",
  description: "Log in to your Airsoft Draws Host dashboard to manage your competitions, view earnings, and monitor sales in real-time.",
};

/**
 * Host Login Page. Composes HostAuthLayout and HostLoginForm.
 */
export default function HostLoginPage() {
  return (
    <HostAuthLayout mode="login">
      <HostLoginForm />
    </HostAuthLayout>
  );
}
