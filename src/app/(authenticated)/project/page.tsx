import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProjectClient } from "./project-client";

export default async function ProjectPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const submissions = await prisma.submission.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return <ProjectClient submissions={submissions} />;
}
