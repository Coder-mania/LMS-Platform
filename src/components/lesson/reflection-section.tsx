"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export function ReflectionSection({
  unitId,
  prompt,
}: {
  unitId: string;
  prompt: string;
}) {
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/reflection?unitId=${unitId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.content) {
          setContent(data.content);
          setSaved(true);
        }
      })
      .catch(() => {});
  }, [unitId]);

  const handleSave = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId, content }),
      });
      if (res.ok) setSaved(true);
    } catch {
      alert("Failed to save reflection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🪞 Reflection</h2>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-4 italic">&ldquo;{prompt}&rdquo;</p>
          <Textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setSaved(false);
            }}
            placeholder="Write your reflection here..."
            rows={5}
          />
          <div className="flex items-center gap-3 mt-3">
            <Button onClick={handleSave} disabled={loading || !content.trim()}>
              {loading ? "Saving..." : "Save Reflection"}
            </Button>
            {saved && (
              <span className="text-sm text-primary">✓ Saved</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
