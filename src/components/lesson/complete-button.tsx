"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function CompleteButton({
  unitId,
  completed,
}: {
  unitId: string;
  completed: boolean;
}) {
  const [done, setDone] = useState(completed);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId }),
      });
      if (res.ok) {
        setDone(true);
        router.refresh();
      }
    } catch {
      alert("Failed to mark complete");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 text-primary">
        <CheckCircle size={20} />
        <span className="font-medium">Unit Completed</span>
      </div>
    );
  }

  return (
    <Button onClick={handleComplete} disabled={loading} size="lg">
      {loading ? "Marking..." : "Mark Unit Complete ✓"}
    </Button>
  );
}
