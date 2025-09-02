import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, favoriteMovie } = await request.json();

    if (!email || !favoriteMovie) {
      return NextResponse.json(
        { error: "Email and favorite movie are required" },
        { status: 400 }
      );
    }

    // Update user's favorite movie in database
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { favoriteMovie },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving favorite movie:", error);
    return NextResponse.json(
      { error: "Failed to save favorite movie" },
      { status: 500 }
    );
  }
}
