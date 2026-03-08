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

    const { unitId, content } = await request.json();

    if (!unitId || !content) {
      return NextResponse.json(
        { error: "unitId and content are required" },
        { status: 400 }
      );
    }

    const reflection = await prisma.reflection.create({
      data: {
        userId: session.user.id,
        unitId,
        content,
      },
    });

    return NextResponse.json(reflection, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save reflection" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unitId = searchParams.get("unitId");

    const reflection = await prisma.reflection.findFirst({
      where: {
        userId: session.user.id,
        ...(unitId ? { unitId } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reflection);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch reflection" },
      { status: 500 }
    );
  }
}
