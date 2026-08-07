import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from "motion/react";
import deviceAsset from "@/assets/images/iphone-hero-rosa.png.asset.json";

const deviceImg = deviceAsset.url;

const SPRING = { stiffness: 150, damping: 18, mass: 0.6 };

export default function HeroDevice() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Posição do ponteiro normalizada de -0.5 a 0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);

  // Inclinação 3D
  const rotateY = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-14, 14]);

  // Deslocamento sutil do aparelho (dá sensação de peso)
  const translateX = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const translateY = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  // Reflexo especular varre a tela conforme a inclinação
  const shineX = useTransform(sx, [-0.5, 0.5], ["-40%", "140%"]);
  const shineOpacity = useTransform(sx, [-0.5, 0, 0.5], [0.14, 0.05, 0.14]);

  // Parallax de scroll no primeiro viewport
  const { scrollY } = useScroll();
  const scrollLift = useTransform(scrollY, [0, 900], [0, 110]);
  const scrollFade = useTransform(scrollY, [0, 700], [1, 0.45]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse") return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  if (reduced) {
    return (
      <div className="mx-auto w-[min(78vw,460px)]">
        <img
          src={deviceImg}
          alt="iPhone em destaque na Guara iPhones"
          width={521}
          height={651}
          fetchPriority="high"
          decoding="async"
          className="block h-auto w-full object-contain select-none"
        />
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      className="relative mx-auto flex w-[min(78vw,460px)] items-center justify-center [perspective:1200px]"
    >
      {/* Aparelho */}
      <motion.div
        style={{ y: scrollLift, opacity: scrollFade }}
        className="w-full"
      >
        <motion.div
          drag
          dragElastic={0.16}
          dragSnapToOrigin
          dragConstraints={{ left: -40, right: 40, top: -30, bottom: 30 }}
          style={{
            rotateX,
            rotateY,
            x: translateX,
            y: translateY,
            transformStyle: "preserve-3d",
          }}
          animate={{ translateZ: [0, 14, 0] }}
          transition={{
            translateZ: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative w-full cursor-grab touch-none active:cursor-grabbing"
        >
          <img
            src={deviceImg}
            alt="iPhone em destaque na Guara iPhones"
            width={521}
            height={651}
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="pointer-events-none block h-auto w-full object-contain select-none"
          />

          {/* Reflexo especular sobre a tela */}
          <motion.div
            aria-hidden="true"
            style={{ x: shineX, opacity: shineOpacity }}
            className="pointer-events-none absolute inset-y-[16%] left-0 w-[38%] -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent blur-md"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
