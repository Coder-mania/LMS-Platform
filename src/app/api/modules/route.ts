import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      orderBy: { order: "asc" },
      include: {
        units: {
          orderBy: { order: "asc" },
          select: { id: true, title: true, order: true },
        },
      },
    });
    return NextResponse.json(modules);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}
