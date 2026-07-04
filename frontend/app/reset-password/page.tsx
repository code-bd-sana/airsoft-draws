import React, { Suspense } from "react";
import { Metadata } from "next";
import UserAuthLayout from "../../components/user-auth/UserAuthLayout";
import ResetPasswordForm from "../../components/user-auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Airsoft Draws",
  description: "Enter your new password to access your Airsoft Draws account.",
};

export default function ResetPasswordPage() {
  return (
    <UserAuthLayout mode="login">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </UserAuthLayout>
  );
}
