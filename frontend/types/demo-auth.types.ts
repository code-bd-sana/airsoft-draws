export type DemoRole = "user" | "host" | "admin";

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  avatar?: string;
}
