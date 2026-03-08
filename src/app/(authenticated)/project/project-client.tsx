"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Submission {
  id: string;
  type: string;
  text: string | null;
  createdAt: Date;
}

export function ProjectClient({ submissions }: { submissions: Submission[] }) {
  const [text, setText] = useState("");
  const [type, setType] = useState("system-map");
  const [loading, setLoading] = useState(false);
  const [allSubmissions, setAllSubmissions] = useState(submissions);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, text }),
      });
      if (res.ok) {
        const data = await res.json();
        setAllSubmissions([data, ...allSubmissions]);
        setText("");
      }
    } catch {
      alert("Failed to submit project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          🎯 System Mapping Challenge
        </h1>
        <p className="text-muted-foreground mt-2">
          Your milestone project — apply everything you&apos;ve learned
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Brief</CardTitle>
          <CardDescription>
            Complete the following three steps and submit your work
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                1
              </span>
              <div>
                <p className="font-medium">Identify an Environmental Problem</p>
                <p className="text-sm text-muted-foreground">
                  Choose a real environmental challenge in your community or region
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                2
              </span>
              <div>
                <p className="font-medium">Map the Connected Systems</p>
                <p className="text-sm text-muted-foreground">
                  Identify the interconnected systems (economic, social, ecological) that relate to this problem
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                3
              </span>
              <div>
                <p className="font-medium">Propose Intervention Points</p>
                <p className="text-sm text-muted-foreground">
                  Suggest where and how interventions could create positive change
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submit Your Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Submission Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="system-map">System Map</option>
              <option value="analysis">Written Analysis</option>
              <option value="proposal">Intervention Proposal</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Your Response</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe your system mapping analysis, the problem you identified, connected systems, and proposed interventions..."
              rows={10}
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading || !text.trim()}>
            {loading ? "Submitting..." : "Submit Project"}
          </Button>
        </CardContent>
      </Card>

      {allSubmissions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Submissions</h2>
          <div className="space-y-3">
            {allSubmissions.map((sub) => (
              <Card key={sub.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{sub.type}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-line">{sub.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
