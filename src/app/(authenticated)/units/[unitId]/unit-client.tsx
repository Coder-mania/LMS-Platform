"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { FlipCardGrid } from "@/components/lesson/flip-card";
import { QuizSection } from "@/components/lesson/quiz-section";
import { ReflectionSection } from "@/components/lesson/reflection-section";
import { CompleteButton } from "@/components/lesson/complete-button";
import { VideoEmbed } from "@/components/lesson/video-embed";

interface UnitData {
  id: string;
  title: string;
  intro: string;
  conceptText: string;
  frameworkText: string;
  caseStudy: string;
  videoUrl: string | null;
  reflectionPrompt: string;
  order: number;
  module: { id: string; title: string };
  flipCards: { id: string; front: string; back: string }[];
  quizQuestions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export function UnitClient({
  unit,
  completed,
}: {
  unit: UnitData;
  completed: boolean;
}) {
  return (
    <div className="space-y-10 pb-12">
      {/* Navigation */}
      <div>
        <Link href={`/modules/${unit.module.id}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> {unit.module.title}
          </Button>
        </Link>
        <Badge variant="secondary" className="mb-2">
          Unit {unit.order}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">{unit.title}</h1>
      </div>

      {/* 1. Intro */}
      <section>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {unit.intro}
        </p>
      </section>

      {/* 2. Concept Explanation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">📖 Concept</h2>
        <Card>
          <CardContent className="p-6 prose prose-green max-w-none">
            <p className="leading-relaxed whitespace-pre-line">{unit.conceptText}</p>
          </CardContent>
        </Card>
      </section>

      {/* 3. Framework */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🔬 Framework</h2>
        <Card>
          <CardContent className="p-6">
            <p className="leading-relaxed whitespace-pre-line">{unit.frameworkText}</p>
          </CardContent>
        </Card>
      </section>

      {/* 4. Flip Cards */}
      <section>
        <FlipCardGrid cards={unit.flipCards} />
      </section>

      {/* 5. Case Study */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🌍 Case Study</h2>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <p className="leading-relaxed whitespace-pre-line">{unit.caseStudy}</p>
          </CardContent>
        </Card>
      </section>

      {/* 6. Video */}
      <section>
        <VideoEmbed url={unit.videoUrl} />
      </section>

      {/* 7. Reflection */}
      <section>
        <ReflectionSection unitId={unit.id} prompt={unit.reflectionPrompt} />
      </section>

      {/* 8. Quiz */}
      <section>
        <QuizSection unitId={unit.id} questions={unit.quizQuestions} />
      </section>

      {/* 9. Complete */}
      <section className="pt-4 border-t">
        <CompleteButton unitId={unit.id} completed={completed} />
      </section>
    </div>
  );
}
