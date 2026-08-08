import { motion, useReducedMotion } from "motion/react";
import { useScrolledPast } from "@/hooks/useScrollPosition";
import { waLink, WA_MESSAGES, trackWhatsApp } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

export function WhatsAppFAB() {
  const visible = useScrolledPast(400);
  const reduce = useReducedMotion();

  return (
    <motion.a
      href={waLink(WA_MESSAGES.generico)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp("fab")}
      aria-label="Falar no WhatsApp"
      className="fixed right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-violet"
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={
        visible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
      }
      transition={{ duration: reduce ? 0.2 : 0.35, ease: [0.22, 1, 0.36, 1] }}
      {...(reduce ? {} : { whileTap: { scale: 0.95 } })}
    >
      {!reduce && visible && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-whatsapp"
          animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      )}
      <WhatsAppIcon
        size={32}
        variant="white"
        className="relative rounded-full"
      />
    </motion.a>
  );
}
