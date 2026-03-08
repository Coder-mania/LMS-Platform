import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { unitId, answers } = await request.json();

    if (!unitId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "unitId and answers array are required" },
        { status: 400 }
      );
    }

    const questions = await prisma.quizQuestion.findMany({
      where: { unitId },
    });

    let correct = 0;
    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (question && question.correctAnswer === answer.selectedAnswer) {
        correct++;
      }
    }

    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    const passed = score >= 60;

    return NextResponse.json({ score, passed, correct, total: questions.length });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
