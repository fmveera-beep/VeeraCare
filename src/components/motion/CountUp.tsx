"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type CountUpProps = {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export function CountUp({
  end,
  duration = 1.6,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let cancelled = false;
    let start: number | null = null;

    const step = (t: number) => {
      if (cancelled) return;
      if (start === null) start = t;
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - (1 - p) ** 3;
      setValue(Math.round(eased * end));
      if (p < 1) requestAnimationFrame(step);
    };

    const id = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [isInView, end, duration]);

  // If the counter never starts (e.g. devtools viewport quirks), show the final value.
  useEffect(() => {
    if (!isInView) return;
    const timer = window.setTimeout(() => {
      setValue((current) => (current === 0 ? end : current));
    }, duration * 1000 + 250);
    return () => clearTimeout(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
