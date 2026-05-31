import { useState } from "react";
import { useKeyNav } from "@/hooks/useKeyNav";
import { useSound } from "@/hooks/useSound";
import { TABS, type Tab, type Lang } from "@/constants/translations";
import NavBar from "./NavBar";
import MobileNav from "./MobileNav";
import HomeSection from "@/components/sections/Home";
import AboutSection from "@/components/sections/About";
import SkillsSection from "@/components/sections/Skills";
import ProjectsSection from "@/components/sections/Projects";
import ContactSection from "@/components/sections/Contact";
import ScanLines from "@/components/ui/ScanLines";

interface ShellProps {
  lang: Lang;
}

export default function Shell({ lang }: ShellProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const { play } = useSound();

  useKeyNav((e) => {
    if (e.key === "ArrowRight") {
      play("/click1.mp3");
      setActiveTab((cur) => {
        const i = TABS.indexOf(cur);
        return TABS[(i + 1) % TABS.length];
      });
    } else if (e.key === "ArrowLeft") {
      play("/click1.mp3");
      setActiveTab((cur) => {
        const i = TABS.indexOf(cur);
        return TABS[(i - 1 + TABS.length) % TABS.length];
      });
    }
  }, []);

  const renderSection = () => {
    switch (activeTab) {
      case "Home":     return <HomeSection lang={lang} />;
      case "About":    return <AboutSection lang={lang} />;
      case "Skills":   return <SkillsSection lang={lang} />;
      case "Projects": return <ProjectsSection lang={lang} />;
      case "Contact":  return <ContactSection lang={lang} />;
    }
  };

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden"
      style={{ background: "var(--c-bg)" }}
    >
      <ScanLines />
      <NavBar activeTab={activeTab} lang={lang} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-hidden" key={activeTab}>
        {renderSection()}
      </main>
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
