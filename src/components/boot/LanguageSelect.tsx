import { useState } from "react";
import { useKeyNav } from "@/hooks/useKeyNav";
import { useSound } from "@/hooks/useSound";
import { LANG_OPTIONS, type Lang } from "@/constants/translations";
import GridBg from "@/components/ui/GridBg";
import CursorBlink from "@/components/ui/CursorBlink";

interface LanguageSelectProps {
  onSelect: (lang: Lang) => void;
}

export default function LanguageSelect({ onSelect }: LanguageSelectProps) {
  const { play } = useSound();
  const [hover, setHover] = useState<Lang | null>(null);

  const select = (lang: Lang) => {
    play("/click2.mp3");
    onSelect(lang);
  };

  useKeyNav((e) => {
    const opt = LANG_OPTIONS.find((o) => o.key.toLowerCase() === e.key.toLowerCase());
    if (opt) select(opt.lang);
  }, []);

  return (
    <div
      className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--c-bg)" }}
    >
      <GridBg />

      {/* Corner decorators */}
      <span className="corner-tl absolute top-6 left-6 w-5 h-5" aria-hidden="true" />
      <span className="corner-tr absolute top-6 right-6 w-5 h-5" aria-hidden="true" />
      <span className="corner-bl absolute bottom-6 left-6 w-5 h-5" aria-hidden="true" />
      <span className="corner-br absolute bottom-6 right-6 w-5 h-5" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md px-8 flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-1 stagger-1">
          <div
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: "var(--c-text-muted)", fontFamily: "var(--font-mono)" }}
          >
            boot@glasscube:~$
          </div>
          <div className="flex items-center gap-2">
            <span
              className="glow-text text-sm tracking-[0.1em]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              SELECT LANGUAGE
            </span>
            <CursorBlink />
          </div>
        </div>

        {/* Language grid */}
        <div className="grid grid-cols-2 gap-3 stagger-2">
          {LANG_OPTIONS.map(({ key, label, native, lang }) => (
            <button
              key={lang}
              className="lang-btn"
              onMouseEnter={() => setHover(lang)}
              onMouseLeave={() => setHover(null)}
              onClick={() => select(lang)}
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className="text-base font-medium"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: hover === lang ? "var(--c-green)" : "var(--c-text)",
                      textShadow: hover === lang ? "var(--glow-sm)" : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    {native}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--c-green)",
                      background: "var(--c-green-glow-sm)",
                      border: "1px solid var(--c-border-dim)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {key}
                  </span>
                </div>
                <span
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--c-text-muted)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Hint */}
        <div
          className="text-xs tracking-widest text-center stagger-3"
          style={{ color: "var(--c-text-muted)", fontFamily: "var(--font-mono)" }}
        >
          PRESS KEY OR CLICK TO SELECT
        </div>
      </div>
    </div>
  );
}
