import React from "react";
import HostSalesClient from "./HostSalesClient";

export const metadata = {
  title: "Competition Sales | Host Dashboard",
  description: "Live sales metrics, revenue analytics, and raffle breakdown for host competitions.",
};

export default function CompetitionSalesPage() {
  return <HostSalesClient />;
}
