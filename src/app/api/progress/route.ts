import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { unitId } = await request.json();

    if (!unitId) {
      return NextResponse.json(
        { error: "unitId is required" },
        { status: 400 }
      );
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_unitId: {
          userId: session.user.id,
          unitId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        unitId,
        completed: true,
        completedAt: new Date(),
      },
    });

    return NextResponse.json(progress);
  } catch {
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await prisma.progress.findMany({
      where: { userId: session.user.id, completed: true },
      select: { unitId: true, completedAt: true },
    });

    return NextResponse.json(progress);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
