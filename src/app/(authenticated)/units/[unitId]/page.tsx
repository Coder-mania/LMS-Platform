import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UnitClient } from "./unit-client";

export default async function UnitPage({
  params,
}: {
  params: { unitId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const unit = await prisma.unit.findUnique({
    where: { id: params.unitId },
    include: {
      module: { select: { id: true, title: true } },
      flipCards: true,
      quizQuestions: true,
    },
  });

  if (!unit) notFound();

  const progress = await prisma.progress.findUnique({
    where: {
      userId_unitId: {
        userId: session.user.id,
        unitId: unit.id,
      },
    },
  });

  // Serialize quiz questions options
  const serializedQuestions = unit.quizQuestions.map((q) => ({
    ...q,
    options: typeof q.options === "string" ? JSON.parse(q.options) : q.options as string[],
  }));

  return (
    <UnitClient
      unit={{
        ...unit,
        quizQuestions: serializedQuestions,
      }}
      completed={progress?.completed ?? false}
    />
  );
}
