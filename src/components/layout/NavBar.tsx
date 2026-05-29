import { useSound } from "@/hooks/useSound";
import { TABS, type Tab, type Lang } from "@/constants/translations";

interface NavBarProps {
  activeTab: Tab;
  lang: Lang;
  onTabChange: (tab: Tab) => void;
}

const LANG_LABELS: Record<Lang, string> = {
  en: "EN",
  ko: "KO",
  ru: "RU",
  uz: "UZ",
};

export default function NavBar({ activeTab, lang, onTabChange }: NavBarProps) {
  const { play } = useSound();

  const handleTab = (tab: Tab) => {
    if (tab !== activeTab) {
      play("/click2.mp3");
      onTabChange(tab);
    }
  };

  return (
    <header
      className="relative z-20 flex items-center justify-between px-5 shrink-0"
      style={{
        height: 48,
        borderBottom: "1px solid var(--c-border-dim)",
        background: "rgba(3, 6, 8, 0.92)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Logo + brand */}
      <div className="flex items-center gap-2.5 shrink-0">
        <img
          src="/logo.png"
          alt="GlassCube"
          style={{ width: 22, height: 22, objectFit: "contain", opacity: 0.9 }}
        />
        <span
          className="glow-text-dim text-xs tracking-[0.22em] font-semibold"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          GLASSCUBE
        </span>
        <span
          className="text-xs"
          style={{ color: "var(--c-border)", fontFamily: "var(--font-mono)" }}
        >
          /
        </span>
        <span
          className="text-xs lowercase"
          style={{ color: "var(--c-text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}
        >
          {activeTab.toLowerCase()}
        </span>
      </div>

      {/* Tabs — center */}
      <nav className="flex items-end h-full" aria-label="Main navigation">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`nav-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTab(tab)}
            aria-current={activeTab === tab ? "page" : undefined}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* Status + lang */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "var(--c-green)",
              boxShadow: "var(--glow-sm)",
              display: "inline-block",
              animation: "blink 2.5s ease-in-out infinite",
            }}
          />
          <span
            className="text-xs tracking-widest"
            style={{ color: "var(--c-text-dim)", fontFamily: "var(--font-mono)" }}
          >
            ONLINE
          </span>
        </div>
        <div
          className="text-xs px-1.5 py-0.5"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--c-text-dim)",
            border: "1px solid var(--c-border-dim)",
            letterSpacing: "0.1em",
          }}
        >
          {LANG_LABELS[lang]}
        </div>
      </div>
    </header>
  );
}
