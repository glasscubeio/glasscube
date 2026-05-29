import { useCallback } from "react";

export function useSound() {
  const play = useCallback((path: string, volume = 0.35) => {
    try {
      const audio = new Audio(path);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch {
      // silently ignore audio errors
    }
  }, []);

  return { play };
}
