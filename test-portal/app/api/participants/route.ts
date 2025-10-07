import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cache } from "react";

export async function GET() {
  try {
    const participant = await prisma.user.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        groupMembers: {
          select: {
            joinedAt: true,

            group: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },

        attempts: true,
      },
    });
    return NextResponse.json(participant, { status: 200 });
  } catch (e) {
    console.error("Database query failed:", e);
    return NextResponse.json(
      { error: "Failed to fetch participants from database." },
      { status: 500 } // Internal Server Error
    );
  }
}
