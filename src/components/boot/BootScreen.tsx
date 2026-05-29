import { useEffect, useState } from "react";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useKeyNav } from "@/hooks/useKeyNav";
import { useSound } from "@/hooks/useSound";
import { BOOT_LINES } from "@/constants/translations";
import GridBg from "@/components/ui/GridBg";
import CursorBlink from "@/components/ui/CursorBlink";

interface BootScreenProps {
  onBoot: () => void;
}

export default function BootScreen({ onBoot }: BootScreenProps) {
  const { play } = useSound();
  const [phase, setPhase] = useState<"logo" | "loading" | "ready">("logo");
  const [progressDone, setProgressDone] = useState(false);
  const visible = useTypewriter(BOOT_LINES, 220);

  // Phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("loading"), 900);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (visible >= BOOT_LINES.length) {
      const t = setTimeout(() => {
        setProgressDone(true);
        setPhase("ready");
      }, 400);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const handleBoot = () => {
    play("/click1.mp3");
    play("/run.mp3", 0.5);
    onBoot();
  };

  useKeyNav((e) => {
    if (e.key === "Enter" && phase === "ready") handleBoot();
  }, [phase]);

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--c-bg)" }}>
      <GridBg />

      {/* Corner decorators */}
      <span className="corner-tl absolute top-6 left-6 w-5 h-5" aria-hidden="true" />
      <span className="corner-tr absolute top-6 right-6 w-5 h-5" aria-hidden="true" />
      <span className="corner-bl absolute bottom-6 left-6 w-5 h-5" aria-hidden="true" />
      <span className="corner-br absolute bottom-6 right-6 w-5 h-5" aria-hidden="true" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-lg px-8">

        {/* Logo */}
        <div className="flex flex-col items-center gap-4 fade-in">
          <img
            src="/logo.png"
            alt="GlassCube"
            className="boot-logo flicker-anim"
            style={{ width: 96, height: 96, objectFit: "contain" }}
          />
          <div className="flex flex-col items-center gap-0.5">
            <span
              className="glow-text-bright tracking-[0.35em] text-sm font-semibold"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              GLASSCUBE
            </span>
            <span
              className="text-xs tracking-[0.2em] uppercase"
              style={{ color: "var(--c-text-dim)", fontFamily: "var(--font-mono)" }}
            >
              OS v1.0.0
            </span>
          </div>
        </div>

        {/* Boot lines */}
        {phase !== "logo" && (
          <div
            className="w-full glass-panel p-4 space-y-1 fade-in"
            style={{ minHeight: 160 }}
          >
            {BOOT_LINES.slice(0, visible).map((line, i) => (
              <div
                key={i}
                className="text-xs leading-relaxed"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: i === 0
                    ? "var(--c-green)"
                    : i === BOOT_LINES.length - 1
                    ? "var(--c-green-bright)"
                    : "var(--c-text-dim)",
                  textShadow: i === 0 || i === BOOT_LINES.length - 1
                    ? "var(--glow-sm)"
                    : "none",
                  animation: `fadeUp 0.2s ease ${i * 0.02}s both`,
                }}
              >
                {i > 0 && i < BOOT_LINES.length - 1 && (
                  <span style={{ color: "var(--c-text-muted)", marginRight: "0.5rem" }}>›</span>
                )}
                {line}
              </div>
            ))}
            {!progressDone && visible > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <span style={{ color: "var(--c-text-muted)", fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}>
                  ›
                </span>
                <CursorBlink char="▋" />
              </div>
            )}
          </div>
        )}

        {/* Progress bar */}
        {phase !== "logo" && (
          <div className="w-full fade-in" style={{ animationDelay: "0.1s" }}>
            <div
              style={{
                height: 2,
                background: "var(--c-border-dim)",
                overflow: "hidden",
              }}
            >
              <div className="boot-bar-fill" />
            </div>
          </div>
        )}

        {/* Enter prompt */}
        {phase === "ready" && (
          <div className="flex flex-col items-center gap-3 fade-in">
            <button
              onClick={handleBoot}
              className="btn-glow primary text-xs tracking-[0.2em] px-8 py-3"
            >
              [ PRESS ENTER TO INITIALIZE ]
            </button>
            <span
              className="text-xs tracking-widest"
              style={{ color: "var(--c-text-muted)", fontFamily: "var(--font-mono)" }}
            >
              or click above
            </span>
          </div>
        )}
      </div>

      {/* Bottom status */}
      <div
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--c-text-muted)", letterSpacing: "0.15em" }}
      >
        BOKIEV NODIRBEK — PORTFOLIO 2025
      </div>
    </div>
  );
}
