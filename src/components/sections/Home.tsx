import { HOME_CONTENT, type Lang } from "@/constants/translations";
import GridBg from "@/components/ui/GridBg";
import CursorBlink from "@/components/ui/CursorBlink";

interface HomeProps {
  lang: Lang;
}

const STACK = ["TypeScript", "Go", "Rust", "Bun.js", "PostgreSQL", "React"];
const SOCIAL = [
  { label: "GitHub",   href: "https://github.com/nodiry" },
  { label: "LinkedIn", href: "#" },
  { label: "Telegram", href: "#" },
];

export default function HomeSection({ lang }: HomeProps) {
  const t = HOME_CONTENT[lang];

  return (
    <div className="relative w-full h-full overflow-y-auto" style={{ background: "var(--c-bg)" }}>
      <GridBg vignette />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 p-6 lg:p-8 max-w-5xl mx-auto min-h-full">

        {/* ── Left column ── */}
        <div className="flex flex-col gap-5 lg:w-80 shrink-0">

          {/* Profile photo */}
          <div className="stagger-1 flex justify-center lg:justify-start">
            <div
              className="relative"
              style={{ width: 120, height: 120 }}
            >
              {/* Glow ring */}
              <div
                style={{
                  position: "absolute",
                  inset: -3,
                  borderRadius: "50%",
                  border: "1px solid var(--c-border)",
                  boxShadow: "0 0 16px rgba(0,255,65,0.2), inset 0 0 12px rgba(0,255,65,0.06)",
                }}
              />
              <img
                src="/me.png"
                alt="Bokiev Nodirbek"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                  display: "block",
                  filter: "grayscale(15%)",
                }}
              />
              {/* Online indicator */}
              <span
                style={{
                  position: "absolute",
                  bottom: 6,
                  right: 6,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--c-green)",
                  boxShadow: "0 0 8px rgba(0,255,65,0.7)",
                  border: "2px solid var(--c-bg)",
                  animation: "blink 2.5s ease-in-out infinite",
                }}
              />
            </div>
          </div>

          {/* Name + title */}
          <div className="flex flex-col gap-1.5 stagger-2 text-center lg:text-left">
            <h1
              className="glow-text-bright font-semibold leading-tight"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1.05rem",
                letterSpacing: "0.1em",
              }}
            >
              {t.name}
            </h1>
            <p
              className="text-xs leading-relaxed"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--c-text-dim)",
                letterSpacing: "0.04em",
              }}
            >
              {t.title}
            </p>
          </div>

          {/* Meta items */}
          <div
            className="glass-panel p-3.5 flex flex-col gap-2 stagger-3"
            style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)" }}
          >
            {[
              { icon: "📍", text: t.location },
              { icon: "🏢", text: t.role },
              { icon: "🎓", text: t.education },
              { icon: "⚡", text: t.since },
              { icon: "🌐", text: t.available },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-2">
                <span style={{ opacity: 0.7 }}>{icon}</span>
                <span style={{ color: "var(--c-text-dim)" }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 stagger-4">
            <a
              href="/resume.pdf"
              download
              className="btn-glow primary flex-1 text-center"
              style={{ textDecoration: "none", display: "block" }}
            >
              ↓ {t.resumeBtn}
            </a>
          </div>

          {/* Social links */}
          <div className="flex gap-2 stagger-5">
            {SOCIAL.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="btn-glow flex-1 text-center"
                style={{ textDecoration: "none", display: "block" }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Vertical divider ── */}
        <div className="hidden lg:block self-stretch" style={{ width: 1, background: "var(--c-border-dim)" }} />

        {/* ── Right column: terminal output ── */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Terminal header */}
          <div
            className="glass-panel px-4 py-2 flex items-center gap-3 stagger-1 shrink-0"
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
              terminal — bokiev@glasscube
            </span>
          </div>

          {/* Terminal body */}
          <div
            className="glass-panel flex-1 p-5 overflow-y-auto"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}
          >
            <div className="flex flex-col gap-3">

              {/* whoami */}
              <div className="stagger-1">
                <div style={{ color: "var(--c-text-muted)" }}>
                  <span style={{ color: "var(--c-text-dim)" }}>{t.prompt}</span>{" "}
                  <span className="glow-text-dim">whoami</span>
                </div>
                <div style={{ color: "var(--c-text)", paddingLeft: "1rem", paddingTop: "0.2rem" }}>
                  nodirbek_bokiev
                </div>
              </div>

              <div className="line-h" />

              {/* cat profile */}
              <div className="stagger-2">
                <div style={{ color: "var(--c-text-muted)" }}>
                  <span style={{ color: "var(--c-text-dim)" }}>{t.prompt}</span>{" "}
                  <span className="glow-text-dim">cat profile.json</span>
                </div>
                <pre
                  className="mt-2 leading-relaxed"
                  style={{
                    color: "var(--c-text-dim)",
                    paddingLeft: "1rem",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {`{
  `}<span style={{ color: "var(--c-green)" }}>"role"</span>{`: `}<span style={{ color: "var(--c-ice)" }}>"Fullstack Dev @ SRZ Memor"</span>{`,
  `}<span style={{ color: "var(--c-green)" }}>"stack"</span>{`: [`}
                  {STACK.map((s, i) => (
                    <span key={s}>
                      <span style={{ color: "var(--c-ice)" }}>"{s}"</span>
                      {i < STACK.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  {`],
  `}<span style={{ color: "var(--c-green)" }}>"edu"</span>{`: `}<span style={{ color: "var(--c-ice)" }}>"Dongseo Univ, CS"</span>{`,
  `}<span style={{ color: "var(--c-green)" }}>"since"</span>{`: `}<span style={{ color: "var(--c-text)" }}>2018</span>{`,
  `}<span style={{ color: "var(--c-green)" }}>"remote"</span>{`: `}<span style={{ color: "var(--c-green-bright)" }}>true</span>{`
}`}
                </pre>
              </div>

              <div className="line-h" />

              {/* echo status */}
              <div className="stagger-3">
                <div style={{ color: "var(--c-text-muted)" }}>
                  <span style={{ color: "var(--c-text-dim)" }}>{t.prompt}</span>{" "}
                  <span className="glow-text-dim">echo $STATUS</span>
                </div>
                <div
                  style={{ color: "var(--c-green)", paddingLeft: "1rem", paddingTop: "0.2rem" }}
                  className="glow-text-dim"
                >
                  {t.openFor}
                </div>
              </div>

              <div className="line-h" />

              {/* Prompt with cursor */}
              <div className="stagger-4 flex items-center gap-1.5">
                <span style={{ color: "var(--c-text-dim)" }}>{t.prompt}</span>
                <CursorBlink />
              </div>
            </div>
          </div>

          {/* Key hint */}
          <div
            className="text-xs tracking-widest text-center stagger-6"
            style={{ color: "var(--c-text-muted)", fontFamily: "var(--font-mono)" }}
          >
            ← → ARROW KEYS TO NAVIGATE
          </div>
        </div>
      </div>
    </div>
  );
}
