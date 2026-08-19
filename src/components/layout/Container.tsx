import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  narrow,
}: {
  children: ReactNode;
  className?: string | undefined;
  narrow?: boolean | undefined;
}) {
  return (
    <div
      className={cn("mx-auto px-5 md:px-8", narrow ? "max-w-[720px]" : "max-w-[1200px]", className)}
    >
      {children}
    </div>
  );
}
