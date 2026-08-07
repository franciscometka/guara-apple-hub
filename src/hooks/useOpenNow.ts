import { useEffect, useState } from "react";

const OPEN_HOURS: Record<number, [number, number] | null> = {
  0: null, // domingo fechado
  1: [9, 19],
  2: [9, 19],
  3: [9, 19],
  4: [9, 19],
  5: [9, 19],
  6: [9, 15], // sábado
};

export function useOpenNow() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const range = OPEN_HOURS[now.getDay()];
      if (!range) return setOpen(false);
      const minutes = now.getHours() * 60 + now.getMinutes();
      setOpen(minutes >= range[0] * 60 && minutes < range[1] * 60);
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  return open;
}
