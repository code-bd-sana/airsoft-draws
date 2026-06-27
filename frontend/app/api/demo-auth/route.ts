import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DemoRole } from "../../../types/demo-auth.types";

export async function POST(request: Request) {
  try {
    const { action, role } = await request.json();
    const cookieStore = await cookies();

    if (action === "login") {
      if (!role || !["user", "host", "admin"].includes(role as DemoRole)) {
        return NextResponse.json({ error: "Valid role is required" }, { status: 400 });
      }
      
      // Set the demo_role cookie
      cookieStore.set("demo_role", role, {
        httpOnly: true,
        secure: false, // Set to false to support both HTTP and HTTPS on VPS
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return NextResponse.json({ success: true, redirectUrl: `/dashboard/${role}` });
    }

    if (action === "logout") {
      cookieStore.delete("demo_role");
      return NextResponse.json({ success: true, redirectUrl: "/login" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Demo auth error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
