import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

/**
 * POST /api/leads
 * Registers a new interest lead for early access.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email } = body;

    // 1. Basic sanitization
    const cleanName = fullName?.trim() || "";
    const cleanEmail = email?.trim()?.toLowerCase() || "";

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
    const existingLead = await prisma.lead.findUnique({
      where: { email: cleanEmail },
    });

    if (existingLead) {
      return NextResponse.json({ error: "This email is already registered." }, { status: 400 });
    }

    // 4. Save to database
    const lead = await prisma.lead.create({
      data: {
        fullName: cleanName,
        email: cleanEmail,
      },
    });

    return NextResponse.json({ success: true, lead: { id: lead.id } }, { status: 201 });
  } catch (err) {
    console.error("Error creating lead:", err);
    
    // Abstract db connection or schema failures
    return NextResponse.json(
      { error: "A server error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
