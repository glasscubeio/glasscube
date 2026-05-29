import { useEffect, useRef, useState } from "react";

export function useTypewriter(lines: string[], intervalMs = 80, resetKey?: unknown) {
  const [visibleCount, setVisibleCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setVisibleCount(0);

    timerRef.current = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= lines.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lines, intervalMs, resetKey]);

  return visibleCount;
}
