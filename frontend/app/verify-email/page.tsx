import React from "react";
import { Metadata } from "next";
import UserAuthLayout from "../../components/user-auth/UserAuthLayout";
import VerifyEmailForm from "../../components/user-auth/VerifyEmailForm";

export const metadata: Metadata = {
  title: "Verify Email | Airsoft Draws",
  description: "Verify your email address to activate your Airsoft Draws account.",
};

export default function VerifyEmailPage() {
  return (
    <UserAuthLayout mode="register">
      <VerifyEmailForm />
    </UserAuthLayout>
  );
}
