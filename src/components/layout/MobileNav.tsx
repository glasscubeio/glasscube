import { useSound } from "@/hooks/useSound";
import { TABS, type Tab } from "@/constants/translations";

interface MobileNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const LABELS: Record<Tab, string> = {
  Home: "HOME",
  Projects: "PROJECTS",
  About: "ABOUT",
  Skills: "SKILLS",
  Contact: "CONTACT",
};

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const { play } = useSound();

  const handleTab = (tab: Tab) => {
    if (tab !== activeTab) {
      play("/click2.mp3");
      onTabChange(tab);
    }
  };

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-30 flex"
      style={{
        background: "rgba(3, 6, 8, 0.97)",
        borderTop: "1px solid var(--c-border-dim)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      aria-label="Mobile navigation"
    >
      {TABS.map((tab) => {
        const active = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => handleTab(tab)}
            aria-current={active ? "page" : undefined}
            style={{
              flex: 1,
              minHeight: 58,
              padding: "0.55rem 0.25rem",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              color: active ? "var(--c-green)" : "var(--c-text-muted)",
              textShadow: active ? "var(--glow-sm)" : "none",
              position: "relative",
              transition: "color 0.15s ease",
              userSelect: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {active && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: "20%",
                  right: "20%",
                  height: 1,
                  background: "var(--c-green)",
                  boxShadow: "var(--glow-sm)",
                }}
              />
            )}
            {LABELS[tab]}
          </button>
        );
      })}
    </nav>
  );
}
