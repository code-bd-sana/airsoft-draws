export type DashboardRole = "user" | "host" | "admin";

export interface DashboardAccount {
  id: string;
  name: string;
  email: string;
  role: DashboardRole;
  avatar?: string;
}
