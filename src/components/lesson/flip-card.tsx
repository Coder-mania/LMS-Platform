"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  front: string;
  back: string;
}

export function FlipCard({ front, back }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer perspective-1000"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={cn(
          "relative w-full h-48 transition-transform duration-500",
          flipped && "[transform:rotateY(180deg)]"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-lg border bg-card p-6 flex items-center justify-center text-center shadow-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <p className="text-sm text-muted-foreground mb-2">Click to flip</p>
            <p className="font-semibold text-lg">{front}</p>
          </div>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-lg border bg-primary/5 p-6 flex items-center justify-center text-center shadow-sm [transform:rotateY(180deg)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-sm leading-relaxed">{back}</p>
        </div>
      </div>
    </div>
  );
}

export function FlipCardGrid({ cards }: { cards: { id: string; front: string; back: string }[] }) {
  if (!cards.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">💡 Concept Cards</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <FlipCard key={card.id} front={card.front} back={card.back} />
        ))}
      </div>
    </div>
  );
}
