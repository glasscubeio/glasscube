import { useEffect, useState } from "react";
import TabBar from "./TabBar";
import HomeTab from "./Home";
import SkillsTab from "./Skills";
import AboutTab from "./History";
import ProjectsTab from "./Projects";
import ContactTab from "./Contact";
import { playSound, type Lang } from "../App";

const TABS = ["Home", "About", "Skills", "Projects", "Contact"];

export default function Shell({ lang }: { lang: Lang }) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      playSound("/click1.mp3");
      setCurrentTabIndex((i) => (i + 1) % TABS.length);
    } else if (e.key === "ArrowLeft") {
      playSound("/click1.mp3");
      setCurrentTabIndex((i) => (i - 1 + TABS.length) % TABS.length);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const renderTab = () => {
    switch (currentTabIndex) {
      case 0:
        return <HomeTab lang={lang} />;
      case 1:
        return <AboutTab lang={lang} />;
      case 2:
        return <SkillsTab lang={lang} />;
      case 3:
        return <ProjectsTab />;
      case 4:
        return <ContactTab lang={lang} />;
      default:
        return null;
    }
  };

  return (
    <div className="text-terminal-green p-4">
      <TabBar
        tabs={TABS}
        activeIndex={currentTabIndex}
        onTabClick={(index) => {
          playSound("/click2.mp3");
          setCurrentTabIndex(index);
        }}
      />
      <div className="mt-4">{renderTab()}</div>
    </div>
  );
}
