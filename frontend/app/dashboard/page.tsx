import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DemoRole } from "../../types/demo-auth.types";

export default async function DashboardRootPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value as DemoRole | undefined;

  if (role === "admin") redirect("/dashboard/admin");
  if (role === "host") redirect("/dashboard/host");
  if (role === "user") redirect("/dashboard/user");

  redirect("/login");
}
