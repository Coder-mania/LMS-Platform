"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export function QuizSection({
  unitId,
  questions,
}: {
  unitId: string;
  questions: QuizQuestion[];
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    correct: number;
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!questions.length) return null;

  const handleSelect = (questionId: string, option: string) => {
    if (result) return; // Lock after submission
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId,
          answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
            questionId,
            selectedAnswer,
          })),
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      alert("Failed to submit quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📝 Quiz</h2>

      {result && (
        <Card className={cn("mb-6", result.passed ? "border-primary/40 bg-primary/5" : "border-destructive/40 bg-destructive/5")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{result.passed ? "🎉" : "📚"}</span>
              <div>
                <p className="font-semibold text-lg">
                  Score: {result.score}% ({result.correct}/{result.total})
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.passed ? "Great job! You passed!" : "Keep studying and try again."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {questions.map((q, i) => (
          <Card key={q.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {i + 1}. {q.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {q.options.map((option) => {
                  const selected = answers[q.id] === option;
                  const isCorrect = result && option === q.correctAnswer;
                  const isWrong = result && selected && option !== q.correctAnswer;

                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(q.id, option)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-md border text-sm transition-colors",
                        selected && !result && "border-primary bg-primary/10",
                        !selected && !result && "hover:bg-accent",
                        isCorrect && "border-green-500 bg-green-50 text-green-800",
                        isWrong && "border-red-500 bg-red-50 text-red-800"
                      )}
                      disabled={!!result}
                    >
                      {option}
                      {isCorrect && " ✓"}
                      {isWrong && " ✗"}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!result && (
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length || loading}
          className="mt-4"
        >
          {loading ? "Submitting..." : "Submit Quiz"}
        </Button>
      )}
    </div>
  );
}
