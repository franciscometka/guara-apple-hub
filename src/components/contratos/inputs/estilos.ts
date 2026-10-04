import { cn } from "@/lib/utils";

/** Classes compartilhadas pelos inputs do módulo de contratos. */
export function classesInput(temErro: boolean, extra?: string | undefined): string {
  return cn(
    "min-h-11 w-full rounded-md border bg-background px-3 text-sm text-foreground",
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:cursor-not-allowed disabled:opacity-60",
    temErro ? "border-destructive" : "border-input",
    extra,
  );
}
