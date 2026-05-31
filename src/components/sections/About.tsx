import { useRef, useEffect } from "react";
import { useTypewriter } from "@/hooks/useTypewriter";
import { ABOUT_LINES, type Lang } from "@/constants/translations";
import GridBg from "@/components/ui/GridBg";
import CursorBlink from "@/components/ui/CursorBlink";

interface AboutProps {
  lang: Lang;
}

export default function AboutSection({ lang }: AboutProps) {
  const lines = ABOUT_LINES[lang];
  const visible = useTypewriter(lines, 55, lang);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visible]);

  const getLineStyle = (line: string): React.CSSProperties => {
    if (line.startsWith("> cat")) return { color: "var(--c-text-muted)" };
    if (line.startsWith("# "))    return { color: "var(--c-green)", textShadow: "var(--glow-sm)", fontWeight: 600 };
    if (line.startsWith("## "))   return { color: "var(--c-green-dim)", fontWeight: 500, marginTop: "0.5rem" };
    if (line === "")              return { height: "0.6rem" };
    if (line === "> _")           return {};
    return { color: "var(--c-text-dim)" };
  };

  return (
    <div className="relative w-full h-full" style={{ background: "var(--c-bg)" }}>
      <GridBg vignette />

      <div className="relative z-10 flex flex-col h-full max-w-2xl mx-auto p-6 lg:p-8">

        {/* Terminal header */}
        <div
          className="glass-panel px-4 py-2 flex items-center gap-3 shrink-0"
          style={{ borderRadius: 0 }}
        >
          <div className="flex gap-1.5">
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.7 }} />
            ))}
          </div>
          <span
            className="text-xs"
            style={{ color: "var(--c-text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}
          >
            about.md — bokiev@glasscube
          </span>
        </div>

        {/* Content */}
        <div
          ref={scrollRef}
          className="glass-panel flex-1 p-5 pb-[72px] sm:pb-5 overflow-y-auto"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", lineHeight: "1.7" }}
        >
          {lines.slice(0, visible).map((line, i) => {
            const isHeading1 = line.startsWith("# ");
            const isHeading2 = line.startsWith("## ");
            const isCmd = line.startsWith(">");
            const isEmpty = line === "";

            return (
              <div
                key={i}
                style={{
                  ...getLineStyle(line),
                  whiteSpace: "pre-wrap",
                  animation: `fadeUp 0.2s ease ${Math.min(i * 0.015, 0.3)}s both`,
                }}
              >
                {isHeading1 && <span style={{ color: "var(--c-text-muted)", marginRight: 6 }}>#</span>}
                {isHeading2 && <span style={{ color: "var(--c-text-muted)", marginRight: 6 }}>##</span>}
                {isEmpty
                  ? " "
                  : isHeading1
                  ? line.slice(2)
                  : isHeading2
                  ? line.slice(3)
                  : isCmd && line !== "> _"
                  ? (
                    <span>
                      <span style={{ color: "var(--c-text-dim)", marginRight: 6 }}>boot@glasscube:~$</span>
                      <span className="glow-text-dim">{line.slice(2)}</span>
                    </span>
                  )
                  : line}
              </div>
            );
          })}

          {/* Cursor at end */}
          {visible >= lines.length && (
            <div className="flex items-center gap-1.5 mt-1">
              <span style={{ color: "var(--c-text-dim)", fontSize: "0.78rem", fontFamily: "var(--font-mono)" }}>
                boot@glasscube:~$
              </span>
              <CursorBlink />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
