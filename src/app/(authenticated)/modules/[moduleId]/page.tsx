import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ModuleDetailPage({
  params,
}: {
  params: { moduleId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const courseModule = await prisma.module.findUnique({
    where: { id: params.moduleId },
    include: {
      units: { orderBy: { order: "asc" } },
    },
  });

  if (!courseModule) notFound();

  const progress = await prisma.progress.findMany({
    where: {
      userId: session.user.id,
      unitId: { in: courseModule.units.map((u) => u.id) },
      completed: true,
    },
    select: { unitId: true },
  });

  const completedSet = new Set(progress.map((p) => p.unitId));
  const modProgress =
    courseModule.units.length > 0
      ? Math.round((completedSet.size / courseModule.units.length) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/modules">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> All Modules
          </Button>
        </Link>
        <Badge className="mb-2">Module {courseModule.order}</Badge>
        <h1 className="text-3xl font-bold tracking-tight">{courseModule.title}</h1>
        <p className="text-muted-foreground mt-2">{courseModule.description}</p>
        <div className="mt-4 flex items-center gap-4">
          <Progress value={modProgress} className="flex-1 max-w-xs" />
          <span className="text-sm text-muted-foreground">
            {completedSet.size}/{courseModule.units.length} completed
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {courseModule.units.map((unit) => {
          const done = completedSet.has(unit.id);
          return (
            <Link key={unit.id} href={`/units/${unit.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                          done
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {done ? "✓" : unit.order}
                      </div>
                      <CardTitle className="text-lg">{unit.title}</CardTitle>
                    </div>
                    {done && <Badge variant="secondary">Completed</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {unit.intro}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
