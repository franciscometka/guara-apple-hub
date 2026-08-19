import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion, useMotionValue, useSpring } from "motion/react";
import type { ReactNode, MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/hooks/useMediaQuery";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[box-shadow,background-color,border-color,color] duration-200 disabled:pointer-events-none disabled:opacity-50 min-h-11",
  {
    variants: {
      variant: {
        primary: "grad-cta text-white hover:shadow-violet",
        whatsapp: "bg-whatsapp text-white hover:shadow-violet",
        instagram: "grad-instagram text-white hover:shadow-violet",
        secondary:
          "border border-border bg-transparent text-foreground hover:border-violet hover:text-violet-deep",
        outlineDark:
          "border border-white/20 bg-transparent text-white hover:border-violet-glow hover:text-violet-glow",
        ghost: "link-underline bg-transparent px-0 text-violet-deep hover:text-violet",
      },
      size: {
        sm: "px-5 py-2.5 text-sm",
        md: "px-7 py-3.5 text-[0.9375rem]",
        lg: "px-8 py-4 text-base md:text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: ReactNode;
  className?: string | undefined;
  href?: string | undefined;
  external?: boolean | undefined;
  magnetic?: boolean | undefined;
  full?: boolean | undefined;
  onClick?: ((e: MouseEvent<HTMLElement>) => void) | undefined;

  type?: "button" | "submit" | undefined;
  disabled?: boolean | undefined;
  ariaLabel?: string | undefined;
  ariaExpanded?: boolean | undefined;
  ariaControls?: string | undefined;
}

export function Button({
  children,
  className,
  variant,
  size,
  href,
  external,
  magnetic,
  full,
  onClick,
  type = "button",
  disabled,
  ariaLabel,
  ariaExpanded,
  ariaControls,
}: ButtonProps) {
  const reduce = useReducedMotion();
  const finePointer = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 26 });
  const sy = useSpring(y, { stiffness: 260, damping: 26 });

  const magneticProps =
    magnetic && !reduce && finePointer
      ? {
          style: { x: sx, y: sy },
          onMouseMove: (e: MouseEvent<HTMLElement>) => {
            const r = e.currentTarget.getBoundingClientRect();
            x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 12);
            y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 12);
          },
          onMouseLeave: () => {
            x.set(0);
            y.set(0);
          },
        }
      : {};

  const hoverProps = reduce ? {} : { whileHover: { y: -2 }, whileTap: { scale: 0.97 } };

  const classes = cn(buttonVariants({ variant, size }), full && "w-full", className);
  const ariaProps = {
    "aria-label": ariaLabel,
    "aria-expanded": ariaExpanded,
    "aria-controls": ariaControls,
  };

  if (href) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        className={classes}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...hoverProps}
        {...magneticProps}
        {...ariaProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...hoverProps}
      {...magneticProps}
      {...ariaProps}
    >
      {children}
    </motion.button>
  );
}
