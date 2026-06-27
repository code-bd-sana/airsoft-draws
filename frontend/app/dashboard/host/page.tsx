import HostDashboardOverview from "../../../components/dashboard/host/HostDashboardOverview";

export default function HostDashboardPage() {
  return (
    <div className="flex-1 w-full p-4 lg:p-8 overflow-y-auto">
      <HostDashboardOverview />
    </div>
  );
}
