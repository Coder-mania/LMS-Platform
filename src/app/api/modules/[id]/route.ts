import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const courseModule = await prisma.module.findUnique({
      where: { id: params.id },
      include: {
        units: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!courseModule) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(courseModule);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch module" },
      { status: 500 }
    );
  }
}
