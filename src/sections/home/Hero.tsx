import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/images/hero-iphone.jpg";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/GuaraButton";
import { AnimatedGlow } from "@/components/ui/AnimatedGlow";
import { WA_MESSAGES, trackWhatsApp, waLink } from "@/lib/whatsapp";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-ink pt-28 pb-20 md:pt-36 md:pb-28"
    >
      <AnimatedGlow />
      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
            }}
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, y: reduce ? 0 : 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
              }}
              className="text-caption text-violet-glow"
            >
              Guarapuava · Paraná
            </motion.p>

            <motion.h1
              id="hero-title"
              variants={{
                hidden: { opacity: 0, y: reduce ? 0 : 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
              }}
              className="text-display mt-5 text-white"
            >
              O iPhone que você quer.{" "}
              <span className="text-gradient-violet">Do jeito certo.</span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: reduce ? 0 : 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
              }}
              className="text-body-lg mt-6 max-w-[520px] text-white/65"
            >
              Loja Apple e assistência técnica em Guarapuava. Produto original,
              conserto com garantia e atendimento direto no WhatsApp — sem fila,
              sem enrolação.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: reduce ? 0 : 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
              }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Button
                variant="whatsapp"
                size="lg"
                magnetic
                href={waLink(WA_MESSAGES.generico)}
                external
                onClick={() => trackWhatsApp("hero")}
              >
                <MessageCircle size={20} strokeWidth={1.5} aria-hidden="true" />
                Falar no WhatsApp
              </Button>
              <Link to="/produtos" className="contents">
                <Button variant="outlineDark" size="lg">
                  Ver produtos
                  <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            {...(reduce ? {} : { style: { y } })}
            initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease }}
            className="relative"
          >
            <img
              src={heroImg}
              alt="iPhone em destaque sobre fundo escuro na Guara iPhones"
              width={1024}
              height={1024}
              fetchPriority="high"
              decoding="async"
              className="mx-auto w-full max-w-[520px] rounded-2xl object-cover"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
