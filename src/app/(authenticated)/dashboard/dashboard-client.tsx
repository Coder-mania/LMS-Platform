"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Trophy, Target } from "lucide-react";

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  units: { id: string; title: string; order: number }[];
}

interface DashboardClientProps {
  userName: string;
  modules: Module[];
  completedUnitIds: string[];
  totalUnits: number;
  completedUnits: number;
  overallProgress: number;
  nextUnit: { id: string; title: string; moduleName: string } | null;
}

export function DashboardClient({
  userName,
  modules,
  completedUnitIds,
  totalUnits,
  completedUnits,
  overallProgress,
  nextUnit,
}: DashboardClientProps) {
  const completedSet = new Set(completedUnitIds);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {userName} 🌱
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          You are beginning a journey to understand one of the most important transitions in human history.
          The world is moving from an economy powered by fossil fuels and resource extraction toward a green, regenerative economy.
        </p>
        <div className="text-sm text-muted-foreground max-w-3xl">
          This transition will shape:
          <ul className="list-disc pl-5 mt-1 space-y-0.5">
            <li>Future careers</li>
            <li>Global economies</li>
            <li>Environmental systems</li>
            <li>Political decisions</li>
          </ul>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Progress
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Units Completed
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedUnits} / {totalUnits}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Modules
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modules.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Continue learning */}
      {nextUnit && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Continue Learning</p>
              <h3 className="font-semibold text-lg mt-1">{nextUnit.title}</h3>
              <p className="text-sm text-muted-foreground">{nextUnit.moduleName}</p>
            </div>
            <Link href={`/units/${nextUnit.id}`}>
              <Button>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Module cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Modules</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => {
            const modCompleted = mod.units.filter((u) =>
              completedSet.has(u.id)
            ).length;
            const modProgress =
              mod.units.length > 0
                ? Math.round((modCompleted / mod.units.length) * 100)
                : 0;
            return (
              <Link key={mod.id} href={`/modules/${mod.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Module {mod.order}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {modCompleted}/{mod.units.length}
                      </span>
                    </div>
                    <CardTitle className="text-lg mt-2">{mod.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {mod.description}
                    </p>
                    <Progress value={modProgress} />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
