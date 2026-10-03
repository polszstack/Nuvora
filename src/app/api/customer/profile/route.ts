import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();

  if (!session || session.userType !== "CUSTOMER") {
    return NextResponse.json({ error: "Customer sign-in required." }, { status: 401 });
  }

  const customer = await prisma.customer.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true },
  });

  if (!customer) {
    return NextResponse.json({ error: "Customer account not found." }, { status: 404 });
  }

  return NextResponse.json({ customer }, { headers: { "Cache-Control": "private, no-store" } });
}

