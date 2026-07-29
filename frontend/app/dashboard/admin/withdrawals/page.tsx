import React from "react";
import AdminWithdrawalsClient from "./AdminWithdrawalsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Withdraw Requests | Admin Dashboard",
  description: "Manage and process host withdrawal requests with 10% platform fee deduction.",
};

export default function AdminWithdrawalsPage() {
  return <AdminWithdrawalsClient />;
}
