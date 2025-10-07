import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      select: {
        id: true,
        name: true,
      },
      take: 5,
    });

    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups from database." },
      { status: 500 } // Internal Server Error
    );
  }
}
