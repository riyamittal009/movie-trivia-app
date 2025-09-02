import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Get user's favorite movie from database
    const user = await prisma.user.findUnique({
      where: { email },
      select: { favoriteMovie: true },
    });

    return NextResponse.json({
      favoriteMovie: user?.favoriteMovie || null,
    });
  } catch (error) {
    console.error("Error getting favorite movie:", error);
    return NextResponse.json(
      { error: "Failed to get favorite movie" },
      { status: 500 }
    );
  }
}
