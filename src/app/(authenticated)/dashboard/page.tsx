import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [modules, progress] = await Promise.all([
    prisma.module.findMany({
      orderBy: { order: "asc" },
      include: {
        units: {
          orderBy: { order: "asc" },
          select: { id: true, title: true, order: true },
        },
      },
    }),
    prisma.progress.findMany({
      where: { userId: session.user.id, completed: true },
      select: { unitId: true },
    }),
  ]);

  const completedUnitIds = new Set(progress.map((p) => p.unitId));
  const totalUnits = modules.reduce((acc, m) => acc + m.units.length, 0);
  const completedUnits = progress.length;
  const overallProgress = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  // Find next incomplete unit
  let nextUnit: { id: string; title: string; moduleName: string } | null = null;
  for (const mod of modules) {
    for (const unit of mod.units) {
      if (!completedUnitIds.has(unit.id)) {
        nextUnit = { id: unit.id, title: unit.title, moduleName: mod.title };
        break;
      }
    }
    if (nextUnit) break;
  }

  return (
    <DashboardClient
      userName={session.user.name}
      modules={modules}
      completedUnitIds={Array.from(completedUnitIds)}
      totalUnits={totalUnits}
      completedUnits={completedUnits}
      overallProgress={overallProgress}
      nextUnit={nextUnit}
    />
  );
}
