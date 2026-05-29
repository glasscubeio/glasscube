import { useEffect, useRef, useState, type JSX } from "react";
import type { Lang } from "../App";

const translations: Record<Lang, (string | JSX.Element)[]> = {
  en: [
    `boot@resume:~$ echo "Welcome to Robert's Terminal Resume"`,
    `Welcome to Robert's Terminal Resume`,
    ``,
    `Name: Bokiev Nodirbek`,
    `Title: Senior Backend Developer & System Architect`,
    `Location: Busan, South Korea`,
    `Education: Dongseo University`,
    `Current Role: Fullstack Developer`,
    ``,
    `Tech Stack & Expertise:`,
    ` - Backend: Bun.js, Node.js, TypeScript, Go, Java`,
    ` - Frameworks: Express, Fastify, Go Fiber, Spring Boot, Actix`,
    ` - Frontend: Next.js, React, Vite`,
    ` - Databases: MongoDB, PostgreSQL, Memcached`,
    ` - Protocols: gRPC, WebSocket, REST API`,
    ``,
    `Download Resume: [link]`,
    `Contact: worknadir95@gmail.com`,
    `Social: GitHub, LinkedIn, Telegram`,
  ],
  uz: [
    `boot@resume:~$ echo "Robertning Terminal Rezyumesiga xush kelibsiz"`,
    `Robertning Terminal Rezyumesiga xush kelibsiz`,
    ``,
    `Ism: Bokiev Nodirbek`,
    `Lavozim: Senior Backend Dasturchi & Sistema Arxitektori`,
    `Manzil: Busan, Janubiy Koreya`,
    `Ta'lim: Dongseo Universiteti`,
    `Hozirgi ish: Fullstack Dasturchi`,
    ``,
    `Tex Stack & Tajriba:`,
    ` - Backend: Bun.js, Node.js, TypeScript, Go, Java`,
    ` - Frameworklar: Express, Fastify, Go Fiber, Spring Boot, Actix`,
    ` - Frontend: Next.js, React, Vite`,
    ` - Ma'lumotlar bazasi: MongoDB, PostgreSQL, Memcached`,
    ` - Protokollar: gRPC, WebSocket, REST API`,
    ``,
    `Rezyumeni yuklab olish: [link]`,
    `Bog'lanish: worknadir95@gmail.com`,
    `Ijtimoiy tarmoqlar: GitHub, LinkedIn, Telegram`,
  ],
  ko: [
    `boot@resume:~$ echo "로버트의 터미널 이력서에 오신 걸 환영합니다"`,
    `로버트의 터미널 이력서에 오신 걸 환영합니다`,
    ``,
    `이름: 보키예프 노디르벡`,
    `직책: 시니어 백엔드 개발자 & 시스템 아키텍트`,
    `위치: 부산, 대한민국`,
    `학력: 동서대학교`,
    `현재 역할: 풀스택 개발자`,
    ``,
    `기술 스택 및 전문 분야:`,
    ` - 백엔드: Bun.js, Node.js, TypeScript, Go, Java`,
    ` - 프레임워크: Express, Fastify, Go Fiber, Spring Boot, Actix`,
    ` - 프론트엔드: Next.js, React, Vite`,
    ` - 데이터베이스: MongoDB, PostgreSQL, Memcached`,
    ` - 프로토콜: gRPC, WebSocket, REST API`,
    ``,
    `이력서 다운로드: [link]`,
    `이메일: worknadir95@gmail.com`,
    `SNS: GitHub, LinkedIn, Telegram`,
  ],
  ru: [
    `boot@resume:~$ echo "Добро пожаловать в терминальное резюме Роберта"`,
    `Добро пожаловать в терминальное резюме Роберта`,
    ``,
    `Имя: Бокиев Нодирбек`,
    `Должность: Старший Backend разработчик и Системный архитектор`,
    `Местоположение: Пусан, Южная Корея`,
    `Образование: Университет Донгсео`,
    `Текущая роль: Fullstack разработчик`,
    ``,
    `Стек технологий и опыт:`,
    ` - Backend: Bun.js, Node.js, TypeScript, Go, Java`,
    ` - Фреймворки: Express, Fastify, Go Fiber, Spring Boot, Actix`,
    ` - Frontend: Next.js, React, Vite`,
    ` - Базы данных: MongoDB, PostgreSQL, Memcached`,
    ` - Протоколы: gRPC, WebSocket, REST API`,
    ``,
    `Скачать резюме: [link]`,
    `Контакт: worknadir95@gmail.com`,
    `Соцсети: GitHub, LinkedIn, Telegram`,
  ],
};

export default function HomeTab({ lang }: { lang: Lang }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<number>(0);

  const lines = translations[lang] || translations.en;

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev < lines.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [lang]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <div className="relative h-[calc(100vh-100px)] overflow-hidden bg-black text-terminal-green font-mono text-sm leading-relaxed">
      {/* Glowing Grid Overlay */}
      <div className="absolute inset-0 z-0 grid grid-cols-20 grid-rows-20 opacity-10 pointer-events-none">
        {[...Array(400)].map((_, i) => (
          <div
            key={i}
            className="border border-green-500 border-opacity-20"
          ></div>
        ))}
      </div>

      {/* Terminal Output */}
      <div
        ref={containerRef}
        className="relative z-10 h-full overflow-y-auto p-4 flex flex-col gap-1"
      >
        {/* Profile Section */}
        <div className="flex items-start gap-4 mb-4">
          <img
            src="/me.png"
            alt="Robert"
            width={100}
            height={100}
            className="rounded-full border border-green-400"
          />
          <div className="flex flex-col justify-start text-terminal-green">
            {lines.slice(3, 8).map((line, i) => (
              <div key={i}>{i < visibleLines - 3 ? line : ""}</div>
            ))}
          </div>
        </div>

        {/* Rest of lines */}
        {lines
          .slice(0, 3)
          .concat(lines.slice(8))
          .map((line, i) => {
            const lineIndex = i < 3 ? i : i + 5; // offset due to profile section
            return (
              <div key={lineIndex} className="whitespace-pre-wrap">
                {lineIndex < visibleLines ? line : ""}
              </div>
            );
          })}

        <div className="h-4" />
      </div>
    </div>
  );
}
