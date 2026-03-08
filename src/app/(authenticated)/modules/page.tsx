import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default async function ModulesPage() {
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

  const completedSet = new Set(progress.map((p) => p.unitId));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modules</h1>
        <p className="text-muted-foreground mt-1">
          Explore all learning modules in your green skills journey
        </p>
      </div>

      <div className="space-y-6">
        {modules.map((mod) => {
          const modCompleted = mod.units.filter((u) =>
            completedSet.has(u.id)
          ).length;
          const modProgress =
            mod.units.length > 0
              ? Math.round((modCompleted / mod.units.length) * 100)
              : 0;

          return (
            <Card key={mod.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge>Module {mod.order}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {modCompleted}/{mod.units.length} units completed
                  </span>
                </div>
                <CardTitle className="text-xl">{mod.title}</CardTitle>
                <p className="text-muted-foreground">{mod.description}</p>
                <Progress value={modProgress} className="mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mod.units.map((unit) => {
                    const done = completedSet.has(unit.id);
                    return (
                      <Link
                        key={unit.id}
                        href={`/units/${unit.id}`}
                        className="flex items-center justify-between p-3 rounded-md hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                              done
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-muted-foreground/30"
                            }`}
                          >
                            {done ? "✓" : unit.order}
                          </div>
                          <span className={done ? "text-muted-foreground" : ""}>
                            {unit.title}
                          </span>
                        </div>
                        {done && (
                          <Badge variant="secondary">Completed</Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
