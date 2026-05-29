import { useEffect, useRef, useState } from "react";
import type { Lang } from "../App";

const skillsData: Record<Lang, string[]> = {
  en: [
    "🛠️ Backend Languages:",
    " - 🟦 TypeScript (primary language for modern backend/frontend)",
    " - 🦀 Rust (for performance-critical systems)",
    " - 🐹 Go (used for servers and concurrency-heavy apps)",
    " - ☕ Java (Spring Boot, mature enterprise projects)",
    "",
    "⚙️ Frameworks & Runtimes:",
    " - ⚡ Bun.js (blazing fast JS runtime)",
    " - 🚀 Fastify, 🧬 Express, 🪄 Actix, 🌀 Go Fiber",
    " - 🌐 React + ⚡ Vite (preferred frontend stack)",
    "",
    "🧩 Databases:",
    " - 🍃 MongoDB (document store for unstructured data)",
    " - 🐘 PostgreSQL (structured relational DB)",
    " - 🧠 Memcached (lightweight caching layer)",
    " - 🦊 Valkey (Redis alternative for caching)",
    "",
    "🔌 Protocols:",
    " - 🔄 gRPC, 🌐 WebSocket, 🔗 REST API",
    "",
    "🧪 Dev Tools:",
    " - 🐳 Docker (containerized dev & deploy)",
    " - 🧠 Design Patterns (GoF principles)",
    " - ⌨️ Neovim (custom terminal IDE)",
    " - 🐧 Ubuntu & Debian (preferred OS for servers)",
  ],
  uz: [
    "🛠️ Backend tillari:",
    " - 🟦 TypeScript (zamonaviy frontend/backend uchun asosiy til)",
    " - 🦀 Rust (samaradorlik kerak bo‘lgan joylar uchun)",
    " - 🐹 Go (serverlar va concurrency uchun)",
    " - ☕ Java (korporativ ilovalar uchun)",
    "",
    "⚙️ Frameworklar va muhitlar:",
    " - ⚡ Bun.js (tezkor JS muhiti)",
    " - 🚀 Fastify, 🧬 Express, 🪄 Actix, 🌀 Go Fiber",
    " - 🌐 React + ⚡ Vite (frontend uchun tanlovim)",
    "",
    "🧩 Ma'lumotlar bazalari:",
    " - 🍃 MongoDB (strukturalanmagan ma'lumotlar uchun)",
    " - 🐘 PostgreSQL (strukturali ma'lumotlar uchun)",
    " - 🧠 Memcached (yengil keshlash)",
    " - 🦊 Valkey (Redis alternativasi)",
    "",
    "🔌 Protokollar:",
    " - 🔄 gRPC, 🌐 WebSocket, 🔗 REST API",
    "",
    "🧪 Dasturiy vositalar:",
    " - 🐳 Docker (containerlar bilan ish)",
    " - 🧠 Design Patterns (GoF printsiplari)",
    " - ⌨️ Neovim (terminal IDE)",
    " - 🐧 Ubuntu va Debian (asosiy server OS)",
  ],
  ru: [
    "🛠️ Backend языки:",
    " - 🟦 TypeScript (основной язык для фронта и бэка)",
    " - 🦀 Rust (для высокопроизводительных задач)",
    " - 🐹 Go (для серверов и многопоточности)",
    " - ☕ Java (Spring Boot, корпоративная разработка)",
    "",
    "⚙️ Фреймворки и среды:",
    " - ⚡ Bun.js (молниеносная JS-среда)",
    " - 🚀 Fastify, 🧬 Express, 🪄 Actix, 🌀 Go Fiber",
    " - 🌐 React + ⚡ Vite (любимый фронт стек)",
    "",
    "🧩 Базы данных:",
    " - 🍃 MongoDB (документное хранилище)",
    " - 🐘 PostgreSQL (реляционная БД)",
    " - 🧠 Memcached (лёгкий кеш)",
    " - 🦊 Valkey (альтернатива Redis)",
    "",
    "🔌 Протоколы:",
    " - 🔄 gRPC, 🌐 WebSocket, 🔗 REST API",
    "",
    "🧪 Инструменты:",
    " - 🐳 Docker (контейнеризация)",
    " - 🧠 Паттерны проектирования (GoF)",
    " - ⌨️ Neovim (терминальная IDE)",
    " - 🐧 Ubuntu и Debian (любимая серверная ОС)",
  ],
  ko: [
    "🛠️ 백엔드 언어:",
    " - 🟦 TypeScript (현대 웹의 주력 언어)",
    " - 🦀 Rust (고성능 시스템용)",
    " - 🐹 Go (서버/동시성 작업)",
    " - ☕ Java (Spring Boot 등)",
    "",
    "⚙️ 프레임워크 & 런타임:",
    " - ⚡ Bun.js (빠른 JS 런타임)",
    " - 🚀 Fastify, 🧬 Express, 🪄 Actix, 🌀 Go Fiber",
    " - 🌐 React + ⚡ Vite (프론트엔드 조합)",
    "",
    "🧩 데이터베이스:",
    " - 🍃 MongoDB (비정형 데이터 저장)",
    " - 🐘 PostgreSQL (정형 데이터)",
    " - 🧠 Memcached (경량 캐시)",
    " - 🦊 Valkey (Redis 대안)",
    "",
    "🔌 통신 프로토콜:",
    " - 🔄 gRPC, 🌐 WebSocket, 🔗 REST API",
    "",
    "🧪 개발 도구:",
    " - 🐳 Docker (컨테이너 기반 개발 및 배포)",
    " - 🧠 디자인 패턴 (GoF 원칙)",
    " - ⌨️ Neovim (터미널 기반 IDE)",
    " - 🐧 Ubuntu / Debian (서버 운영체제)",
  ],
};

export default function SkillsTab({ lang }: { lang: Lang }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const lines = skillsData[lang] || skillsData.en;

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev < lines.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 350);
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
