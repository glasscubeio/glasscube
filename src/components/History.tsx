import { useEffect, useRef, useState } from "react";
import type { Lang } from "../App";

const translations: Record<Lang, string[]> = {
  en: [
    "I'm Nodirbek Bokiev, a backend engineer obsessed with system performance, control, and clean structure.",
    "My journey started in 2018 with Kotlin (and a broken calculator app that couldn’t divide).",
    "Since then, I’ve grown into a builder who deeply values minimalism, brutalist structure, and hands-on experimentation.",
    "",
    "🚀 Philosophy",
    "I love to be in control — backend development gives me that.",
    "From orchestrating complex APIs to handling TBs of data, backend work is discipline + creativity.",
    "If not in tech, I’d be an architect. Structure and brutalism attract me.",
    "",
    "📚 Education & Career",
    "Studied at Dongseo University (Computer Science).",
    "Currently working as a full-stack developer at SRZ Memor, an Uzbek construction tech firm.",
    "",
    "🧠 Learning Stack",
    "Most of my skills come from building projects hands-on.",
    "Courses like CodeWithMosh helped (React, Node.js, SQL, DSA, etc.), but real growth came from experimentation.",
    "I realized the importance of design patterns & architecture (thanks to Gang of Four).",
    "No paradigm fits all — knowing when to use what is true skill.",
    "",
    "🧰 My Tech Stack",
    "TypeScript, Rust, Go, Java, React + Vite, Bun, Fastify, PostgreSQL, MongoDB, Memcached, Valkey, gRPC, WebSocket, Docker.",
    "I started with Node.js, Next.js, Redis — later switched to Bun, Vite, Memcached for speed and control.",
    "",
    "🖥️ Tools & Workflow",
    "Customized terminal with Neovim instead of VSCode.",
    "Terminal-based workflow is my daily driver for performance and control.",
    "",
    "🐧 OS Preference",
    "Dev servers run Ubuntu/Debian for stability and flexibility.",
    "Planning to explore RHEL later due to its robustness.",
  ],
  uz: [
    "Men Nodirbek Bokievman — tizim samaradorligi, nazorat va tozalikni sevuvchi backend dasturchiman.",
    "Yo‘lim 2018-yilda Kotlin bilan boshlandi (bo‘linmaydigan kalkulyator ilovasi bilan).",
    "Shundan beri minimalizm va tajriba asosidagi rivojlanish men uchun asosiy yo‘l bo‘ldi.",
    "",
    "🚀 Falsafam",
    "Nazorat menga yoqadi — backend bu nazoratni beradi.",
    "Kompleks APIlar, TB miqdoridagi ma'lumotlar bilan ishlash — bu tartib va ijoddir.",
    "Agar IT bo‘lmaganida, men arxitektor bo‘lgan bo‘lardim.",
    "",
    "📚 Ta'lim & Ish faoliyatim",
    "Dongseo Universitetida (Koreya) Kompyuter fanlari bo‘yicha o‘qiganman.",
    "Hozir SRZ Memor’da fullstack dasturchiman — bu O‘zbekistondagi qurilish firmasi.",
    "",
    "🧠 O‘rganish yo‘lim",
    "Ko‘nikmalarimni amaliy loyihalardan oldim.",
    "CodeWithMosh kurslari foydali bo‘ldi (React, SQL, DSA), lekin haqiqiy o‘sish loyiha qurishdan keldi.",
    "'Gang of Four' kitobi dizayn naqshlarining ahamiyatini o‘rgatdi.",
    "Har vaziyatga mos texnologiyani tanlash — bu kuch.",
    "",
    "🧰 Texnik to‘plamim",
    "TypeScript, Rust, Go, Java, React + Vite, Bun, Fastify, PostgreSQL, MongoDB, Memcached, Valkey, gRPC, WebSocket, Docker.",
    "Dastlab Node.js, Next.js, Redis ishlatdim. Hozir Bun, Vite, Memcached ishlataman — tezroq va engillashtirilgan.",
    "",
    "🖥️ Ish vositalari",
    "Neovim va terminal asosidagi ish muhiti — VSCode va Chrome’dan voz kechganman.",
    "Terminalda ishlash samarali va nazoratli.",
    "",
    "🐧 OS Tanlovim",
    "Serverlarim Ubuntu/Debian’da ishlaydi — barqaror va ochiq tizimlar.",
    "Kelajakda RHEL’ni o‘rganmoqchiman — ishonchli tizim deb hisoblayman.",
  ],
  ru: [
    "Я Нодирбек Бокиев — backend-инженер, увлечённый производительностью и чистой архитектурой.",
    "Моё путешествие началось в 2018 с Kotlin (и калькулятора, который не умел делить).",
    "С тех пор я стал минималистом, ценящим структуру и эксперименты.",
    "",
    "🚀 Философия",
    "Я люблю контроль — backend-разработка даёт мне это.",
    "От сложных API до обработки терабайтов — это дисциплина и креатив.",
    "Если бы не IT, я бы стал архитектором — структура меня манит.",
    "",
    "📚 Образование и карьера",
    "Учился в университете Донгсо (Южная Корея), направление: Computer Science.",
    "Сейчас работаю fullstack-разработчиком в SRZ Memor — строительной компании из Узбекистана.",
    "",
    "🧠 Обучение",
    "Основные навыки пришли из практики, не только из курсов.",
    "CodeWithMosh (React, SQL, DSA и т.д.) был полезен, но практика дала больше.",
    "Книга 'Gang of Four' изменила мой подход к архитектуре.",
    "Главное — уметь выбрать правильный подход под задачу.",
    "",
    "🧰 Мой стек",
    "TypeScript, Rust, Go, Java, React + Vite, Bun, Fastify, PostgreSQL, MongoDB, Memcached, Valkey, gRPC, WebSocket, Docker.",
    "Начинал с Node.js, Next.js, Redis — сейчас использую Bun, Vite и Memcached из-за производительности.",
    "",
    "🖥️ Инструменты и рабочий процесс",
    "Neovim в терминале, отказ от VSCode — терминал это мощно и эффективно.",
    "",
    "🐧 ОС предпочтение",
    "Серверы на Ubuntu/Debian — стабильность и гибкость.",
    "Планирую изучить RHEL — уважаю надёжные системы.",
  ],
  ko: [
    "저는 노디르벡 보키예프입니다 — 시스템 성능과 구조를 중시하는 백엔드 엔지니어입니다.",
    "2018년에 Kotlin으로 개발을 시작했고, (나누기 안 되는 계산기 앱이 첫 프로젝트였습니다).",
    "그 이후로 저는 미니멀리즘과 실험을 중요시하는 개발자가 되었습니다.",
    "",
    "🚀 철학",
    "저는 제어를 좋아합니다 — 백엔드는 그걸 가능하게 합니다.",
    "복잡한 API와 대용량 데이터를 다루는 일은 창의성과 규율을 요구합니다.",
    "IT가 아니었다면, 저는 아키텍트가 되었을 겁니다.",
    "",
    "📚 학력 및 경력",
    "동서대학교에서 컴퓨터공학을 전공했습니다.",
    "현재는 우즈베키스탄의 건설회사 SRZ Memor에서 풀스택 개발자로 일하고 있습니다.",
    "",
    "🧠 학습 방식",
    "거의 모든 기술은 프로젝트를 통해 배웠습니다.",
    "CodeWithMosh 강의도 도움되었지만 (React, SQL, DSA 등), 실습이 제일 컸습니다.",
    "Gang of Four 책은 제 아키텍처 사고에 큰 영향을 주었습니다.",
    "한 가지 방법이 모든 상황에 맞진 않습니다 — 상황에 맞는 선택이 중요합니다.",
    "",
    "🧰 기술 스택",
    "TypeScript, Rust, Go, Java, React + Vite, Bun, Fastify, PostgreSQL, MongoDB, Memcached, Valkey, gRPC, WebSocket, Docker.",
    "처음에는 Node.js, Next.js, Redis를 사용했지만, 이후 Bun, Vite, Memcached로 전환했습니다.",
    "",
    "🖥️ 도구와 워크플로우",
    "Neovim 기반 터미널 개발 환경을 사용합니다.",
    "VSCode 대신 RAM을 덜 쓰는 환경이 필요했습니다.",
    "",
    "🐧 운영체제 취향",
    "서버는 Ubuntu/Debian 위에서 동작하며 안정성과 유연성을 제공합니다.",
    "앞으로는 RHEL도 공부해보고 싶습니다 — 신뢰성 있는 시스템이라 생각합니다.",
  ],
};

export default function AboutTab({ lang }: { lang: Lang }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const lines = translations[lang] || translations.en;

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev < lines.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [lang]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [visibleLines]);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-100px)] p-4 overflow-y-auto bg-black text-terminal-green font-mono text-base space-y-4"
    >
      {lines.slice(0, visibleLines).map((line, i) => (
        <div key={i} className="whitespace-pre-wrap leading-relaxed">
          {line}
        </div>
      ))}
    </div>
  );
}
