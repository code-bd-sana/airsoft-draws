import { DemoAccount } from "../types/demo-auth.types";

export const demoAccounts: DemoAccount[] = [
  {
    id: "demo-user",
    name: "Demo User",
    email: "user@airsoftdraw.demo",
    role: "user",
    avatar: "https://ui-avatars.com/api/?name=Demo+User&background=1A230A&color=8CB34A",
  },
  {
    id: "demo-host",
    name: "Demo Host",
    email: "host@airsoftdraw.demo",
    role: "host",
    avatar: "https://ui-avatars.com/api/?name=Demo+Host&background=43581E&color=E8EDD4",
  },
  {
    id: "demo-admin",
    name: "Demo Admin",
    email: "admin@airsoftdraw.demo",
    role: "admin",
    avatar: "https://ui-avatars.com/api/?name=Demo+Admin&background=111210&color=A0D056",
  },
];
