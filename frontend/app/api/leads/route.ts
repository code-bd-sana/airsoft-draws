import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

/**
 * POST /api/leads
 * Registers a new interest lead for early access.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, role } = body;

    // 1. Basic sanitization
    const cleanName = fullName?.trim() || "";
    const cleanEmail = email?.trim()?.toLowerCase() || "";
    const rawRole = role?.trim()?.toUpperCase() || "CLIENT";
    const cleanRole = ["HOST", "CLIENT"].includes(rawRole) ? rawRole : (rawRole === "CUSTOMER" ? "CLIENT" : "CLIENT");

    // 2. Server-side validations
    if (!cleanName) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }

    if (!cleanEmail) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    // 3. Duplicate checks
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: "This email is already registered." }, { status: 400 });
    }

    const nameParts = cleanName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // 4. Save to database
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: cleanEmail,
        role: cleanRole,
        passwordHash: "LEAD_NO_PASSWORD", // Dummy value for early access lead
      },
    });

    return NextResponse.json({ success: true, lead: { id: user.id } }, { status: 201 });
  } catch (err) {
    console.error("Error creating lead:", err);
    
    // Abstract db connection or schema failures
    return NextResponse.json(
      { error: "A server error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
