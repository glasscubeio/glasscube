import type { Lang } from "./translations";

export interface SkillCategory {
  title: string;
  items: string[];
}

export const SKILLS_DATA: Record<Lang, SkillCategory[]> = {
  en: [
    {
      title: "Backend Languages",
      items: ["TypeScript", "Go", "Rust", "Java", "Kotlin"],
    },
    {
      title: "Frameworks & Runtimes",
      items: ["Bun.js", "Fastify", "Express", "Go Fiber", "Actix", "Spring Boot"],
    },
    {
      title: "Frontend",
      items: ["React", "Vite", "Next.js", "Tailwind CSS"],
    },
    {
      title: "Databases",
      items: ["PostgreSQL", "MongoDB", "Memcached", "Valkey", "Redis"],
    },
    {
      title: "Protocols & APIs",
      items: ["gRPC", "WebSocket", "REST", "GraphQL"],
    },
    {
      title: "Dev Tools & Infra",
      items: ["Docker", "Linux", "Neovim", "Git", "CI/CD"],
    },
    {
      title: "Architecture",
      items: ["Design Patterns (GoF)", "Microservices", "Event-Driven", "DDD"],
    },
  ],
  ko: [
    {
      title: "백엔드 언어",
      items: ["TypeScript", "Go", "Rust", "Java", "Kotlin"],
    },
    {
      title: "프레임워크 & 런타임",
      items: ["Bun.js", "Fastify", "Express", "Go Fiber", "Actix", "Spring Boot"],
    },
    {
      title: "프론트엔드",
      items: ["React", "Vite", "Next.js", "Tailwind CSS"],
    },
    {
      title: "데이터베이스",
      items: ["PostgreSQL", "MongoDB", "Memcached", "Valkey", "Redis"],
    },
    {
      title: "프로토콜 & API",
      items: ["gRPC", "WebSocket", "REST", "GraphQL"],
    },
    {
      title: "개발 도구 & 인프라",
      items: ["Docker", "Linux", "Neovim", "Git", "CI/CD"],
    },
    {
      title: "아키텍처",
      items: ["디자인 패턴 (GoF)", "마이크로서비스", "이벤트 기반", "DDD"],
    },
  ],
  uz: [
    {
      title: "Backend tillari",
      items: ["TypeScript", "Go", "Rust", "Java", "Kotlin"],
    },
    {
      title: "Frameworklar & Muhitlar",
      items: ["Bun.js", "Fastify", "Express", "Go Fiber", "Actix", "Spring Boot"],
    },
    {
      title: "Frontend",
      items: ["React", "Vite", "Next.js", "Tailwind CSS"],
    },
    {
      title: "Ma'lumotlar bazalari",
      items: ["PostgreSQL", "MongoDB", "Memcached", "Valkey", "Redis"],
    },
    {
      title: "Protokollar & API",
      items: ["gRPC", "WebSocket", "REST", "GraphQL"],
    },
    {
      title: "Dasturiy vositalar",
      items: ["Docker", "Linux", "Neovim", "Git", "CI/CD"],
    },
    {
      title: "Arxitektura",
      items: ["Design Patterns (GoF)", "Microservices", "Event-Driven", "DDD"],
    },
  ],
  ru: [
    {
      title: "Backend языки",
      items: ["TypeScript", "Go", "Rust", "Java", "Kotlin"],
    },
    {
      title: "Фреймворки & среды",
      items: ["Bun.js", "Fastify", "Express", "Go Fiber", "Actix", "Spring Boot"],
    },
    {
      title: "Frontend",
      items: ["React", "Vite", "Next.js", "Tailwind CSS"],
    },
    {
      title: "Базы данных",
      items: ["PostgreSQL", "MongoDB", "Memcached", "Valkey", "Redis"],
    },
    {
      title: "Протоколы & API",
      items: ["gRPC", "WebSocket", "REST", "GraphQL"],
    },
    {
      title: "Инструменты & инфра",
      items: ["Docker", "Linux", "Neovim", "Git", "CI/CD"],
    },
    {
      title: "Архитектура",
      items: ["Паттерны GoF", "Микросервисы", "Event-Driven", "DDD"],
    },
  ],
};
