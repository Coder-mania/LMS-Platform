import { cn } from "@/lib/utils";

function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("relative h-3 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className="h-full bg-primary transition-all duration-500 ease-in-out rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export { Progress };
