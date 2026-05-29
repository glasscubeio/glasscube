import { useEffect } from "react";

type KeyHandler = (e: KeyboardEvent) => void;

export function useKeyNav(handler: KeyHandler, deps: unknown[] = []) {
  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
