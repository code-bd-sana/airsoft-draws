import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signToken } from "../../../../lib/auth";

/**
 * POST /api/admin/auth
 * Validates password and issues an HTTP-only session cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const expectedPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!expectedPassword || !sessionSecret) {
      console.error("ADMIN_PASSWORD or ADMIN_SESSION_SECRET environment variables are missing.");
      return NextResponse.json(
        { error: "Server authentication setup is incomplete." },
        { status: 500 }
      );
    }

    if (password !== expectedPassword) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    // Sign the token
    const token = signToken({ isAdmin: true, loginAt: new Date().toISOString() }, sessionSecret);

    // Set HTTP-only session cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: false, // Set to false to support both HTTP and HTTPS on VPS
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Auth handler error:", err);
    return NextResponse.json({ error: "An authentication error occurred." }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/auth
 * Clears the session cookie to logout.
 */
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "", {
    httpOnly: true,
    secure: false, // Set to false to support both HTTP and HTTPS on VPS
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}
