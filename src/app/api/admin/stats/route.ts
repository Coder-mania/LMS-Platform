import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [users, totalUnits, totalSubmissions, totalProgress] = await Promise.all([
      prisma.user.count(),
      prisma.unit.count(),
      prisma.submission.count(),
      prisma.progress.count({ where: { completed: true } }),
    ]);

    return NextResponse.json({ users, totalUnits, totalSubmissions, totalProgress });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
