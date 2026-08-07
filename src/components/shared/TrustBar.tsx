import {
  ShieldCheck,
  FileCheck2,
  Wrench,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { trustItems } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const icons: LucideIcon[] = [ShieldCheck, FileCheck2, Wrench, MessageCircle];

export function TrustBar() {
  return (
    <div className="border-b border-border bg-background py-6 md:py-8">
      <Container>
        <RevealGroup
          className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8"
          stagger={0.06}
        >
          {trustItems.map((item, i) => {
            const Icon = icons[i] ?? ShieldCheck;
            return (
              <RevealItem key={item}>
                <div className="flex items-center gap-3">
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="shrink-0 text-pink"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-tight text-muted-foreground">
                    {item}
                  </span>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </div>
  );
}
