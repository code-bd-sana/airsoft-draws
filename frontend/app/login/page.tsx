import React from "react";
import { Metadata } from "next";
import UserAuthLayout from "../../components/user-auth/UserAuthLayout";
import UserLoginForm from "../../components/user-auth/UserLoginForm";

export const metadata: Metadata = {
  title: "Player Login | Airsoft Draws",
  description: "Log in to your Airsoft Draws account to view live raffles, purchase tickets, and view winners.",
};

/**
 * Customer/User Login Page. Composes UserAuthLayout and UserLoginForm.
 */
export default function UserLoginPage() {
  return (
    <UserAuthLayout mode="login">
      <UserLoginForm />
    </UserAuthLayout>
  );
}
