import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [user, progress, reflections, submissions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, role: true, createdAt: true },
    }),
    prisma.progress.findMany({
      where: { userId: session.user.id, completed: true },
      include: { unit: { select: { title: true } } },
    }),
    prisma.reflection.count({ where: { userId: session.user.id } }),
    prisma.submission.count({ where: { userId: session.user.id } }),
  ]);

  const totalUnits = await prisma.unit.count();
  const overallProgress = totalUnits > 0 ? Math.round((progress.length / totalUnits) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Role</span>
            <Badge variant="secondary">{user?.role}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Joined</span>
            <span className="font-medium">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Overall Progress</span>
              <span className="text-sm font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{progress.length}</p>
              <p className="text-xs text-muted-foreground">Units Done</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{reflections}</p>
              <p className="text-xs text-muted-foreground">Reflections</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{submissions}</p>
              <p className="text-xs text-muted-foreground">Submissions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {progress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {progress.map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-sm">
                  <span className="text-primary">✓</span>
                  <span>{p.unit.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
