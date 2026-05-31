import { CONTACT_DATA, type Lang } from "@/constants/translations";
import GridBg from "@/components/ui/GridBg";
import GlassPanel from "@/components/ui/GlassPanel";
import CursorBlink from "@/components/ui/CursorBlink";

interface ContactProps {
  lang: Lang;
}

export default function ContactSection({ lang }: ContactProps) {
  const t = CONTACT_DATA[lang];

  return (
    <div className="relative w-full h-full overflow-y-auto" style={{ background: "var(--c-bg)" }}>
      <GridBg vignette />

      <div className="relative z-10 max-w-xl mx-auto p-6 lg:p-8 pb-20 lg:pb-8 flex flex-col gap-6 min-h-full justify-center">

        {/* Terminal prompt */}
        <div
          className="flex items-center gap-2 stagger-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="text-xs" style={{ color: "var(--c-text-muted)" }}>
            boot@glasscube:~$
          </span>
          <span className="glow-text-dim text-xs">cat contact.json</span>
          <CursorBlink />
        </div>

        {/* Main card */}
        <GlassPanel className="p-6 flex flex-col gap-6 stagger-2">

          {/* Heading */}
          <div className="flex flex-col gap-1.5">
            <h2
              className="glow-text font-semibold"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1rem",
                letterSpacing: "0.1em",
              }}
            >
              {t.heading}
            </h2>
            <p
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--c-text-dim)" }}
            >
              {t.subheading}
            </p>
          </div>

          <div className="line-h" />

          {/* Contact items */}
          <div className="flex flex-col gap-3.5">
            {t.items.map(({ label, value, href }) => (
              <div key={label} className="flex items-start gap-3">
                <span
                  className="shrink-0 text-xs"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--c-green-dim)",
                    width: 72,
                    letterSpacing: "0.05em",
                  }}
                >
                  {label}
                </span>
                <span style={{ color: "var(--c-text-muted)", fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}>
                  :
                </span>
                {href ? (
                  <a
                    href={href}
                    className="text-xs leading-relaxed transition-all duration-150 hover:glow-text"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--c-text)",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = "var(--c-green)";
                      (e.target as HTMLElement).style.textShadow = "var(--glow-sm)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = "var(--c-text)";
                      (e.target as HTMLElement).style.textShadow = "none";
                    }}
                  >
                    {value}
                  </a>
                ) : (
                  <span
                    className="text-xs leading-relaxed"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--c-text-dim)" }}
                  >
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="line-h" />

          {/* Social links */}
          <div className="flex flex-col gap-2">
            <span
              className="text-xs tracking-[0.14em] uppercase"
              style={{ fontFamily: "var(--font-mono)", color: "var(--c-text-muted)" }}
            >
              Social
            </span>
            <div className="flex gap-2 flex-wrap">
              {t.social.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-glow"
                  style={{ textDecoration: "none" }}
                >
                  {label} ↗
                </a>
              ))}
            </div>
          </div>
        </GlassPanel>

        {/* Footer note */}
        <div
          className="text-xs text-center tracking-widest stagger-3"
          style={{ color: "var(--c-text-muted)", fontFamily: "var(--font-mono)" }}
        >
          <span style={{ color: "var(--c-border)" }}>›</span> Available for freelance, remote contracts & full-time
        </div>
      </div>
    </div>
  );
}
