import { useState } from "react";
import { type Lang, TITLES } from "@/constants/translations";
import BootScreen from "@/components/boot/BootScreen";
import LanguageSelect from "@/components/boot/LanguageSelect";
import Shell from "@/components/layout/Shell";
import ThanksScreen from "./components/sections/ThanksScreen";

function App() {
  const [booted, setBooted] = useState(false);
  const [lang, setLang] = useState<Lang | null>(null);

  const handleBoot = () => {
    setBooted(true);
  };

  const handleLangSelect = (selected: Lang) => {
    setLang(selected);
    const t = TITLES[selected];
    document.title = `${t.document} — ${t.tab}`;
  };

  // Polar redirects here after a successful donation
  if (window.location.pathname === "/thanks") {
    return <ThanksScreen />;
  }

  if (!booted) return <BootScreen onBoot={handleBoot} />;
  if (!lang) return <LanguageSelect onSelect={handleLangSelect} />;

  return <Shell lang={lang} />;
}

export default App;
