import type { Lang } from "./translations";

export interface Project {
  id: string;
  name: string;
  description: string;
  stack: string[];
  status: "live" | "wip" | "archived";
  github?: string;
  demo?: string;
  year: number;
}

export const PROJECT_CONTENT: Record<
  Lang,
  Record<string, { name: string; description: string }>
> = {
  en: {},
  ko: {
    analytics: {
      name: "애널리틱스",
      description:
        "주니어 시절에 만든 웹사이트 및 모바일 앱 트래픽 분석 서비스.",
    },
    hellostranger: {
      name: "헬로 스트레인저 채팅",
      description:
        "WebRTC 기반 랜덤 영상 채팅. 계정 없이 낯선 사람과 즉시 연결. 프라이버시 우선 설계.",
    },
    chat: {
      name: "프라이빗 채팅",
      description:
        "Socket 기반 1:1 텍스트 채팅. 계정 없이 바로 연결 가능. 프라이버시 우선 설계.",
    },
    "smart-scheduler": {
      name: "스마트 학습 스케줄러",
      description:
        "우선순위 큐, 동적 일정 조정, 자기 개선 기능을 갖춘 AI 기반 학습 스케줄러.",
    },
    "glasscube-portfolio": {
      name: "글래스큐브 포트폴리오",
      description:
        "이 포트폴리오. 터미널 감성 UI, 다국어 지원, 부팅 시퀀스, Tron 영감 디자인.",
    },
    playwright: {
      name: "플레이라이트 데모",
      description: "Playwright의 주요 기능을 시연하는 간단한 웹 앱.",
    },
    botanik: {
      name: "보타닉",
      description:
        "코드베이스를 분석해 테스트를 자동 생성·실행하고 문서도 제공하는 CLI 도구. 백/프론트 개발 모두에 유용.",
    },
    financemate: {
      name: "파이낸스메이트",
      description:
        "거래 분류, 지출 분석, 예산 목표 추적 기능의 개인 재무 대시보드.",
    },
    music: {
      name: "Music player",
      description: "Playlist of my own music.",
    },
  },
  uz: {
    analytics: {
      name: "Analytics",
      description:
        "Junior yilida yaratilgan veb va mobil ilova trafigini tahlil qilish xizmati.",
    },
    hellostranger: {
      name: "Begona bilan Chat",
      description:
        "WebRTC asosida tasodifiy video chat. Hisob kerak emas, darhol bog'laning.",
    },
    chat: {
      name: "Maxfiy Chat",
      description:
        "Socket asosida shaxsiy matnli chat. Hisob kerak emas, darhol ulanish.",
    },
    "smart-scheduler": {
      name: "Aqlli O'quv Rejalashtiruvchi",
      description:
        "Ustuvorlik navbatlari va dinamik o'zgarishlar bilan AI yordamchi o'quv rejalashtiruvchi.",
    },
    "glasscube-portfolio": {
      name: "GlassCube Portfolio",
      description:
        "Ushbu portfolio. Terminal estetikasi, ko'p tilli qo'llab-quvvatlash va Tron dizayni.",
    },
    playwright: {
      name: "Playwright Demo",
      description: "Playwright imkoniyatlarini ko'rsatadigan oddiy demo ilova.",
    },
    botanik: {
      name: "Botanik",
      description:
        "Kodni o'qib, testlarni avtomatik yaratib ishlatadigan va hujjatlar taqdim etadigan CLI vosita.",
    },
    financemate: {
      name: "Moliya Yordamchi",
      description:
        "Tranzaksiyalar tasnifi, xarajat tahlili va byudjet kuzatuvi bilan shaxsiy moliya paneli.",
    },
    music: {
      name: "Music player",
      description: "playlist of my own music",
    },
  },
  ru: {
    analytics: {
      name: "Аналитика",
      description:
        "Сервис аналитики трафика для сайтов и мобильных приложений, создан в студенческие годы.",
    },
    hellostranger: {
      name: "Чат с Незнакомцем",
      description:
        "Случайный видеочат на WebRTC. Без регистрации — мгновенное соединение с незнакомцем.",
    },
    chat: {
      name: "Приватный Чат",
      description:
        "Приватный чат на Socket.io. Без регистрации — мгновенное соединение один на один.",
    },
    "smart-scheduler": {
      name: "Умный Планировщик",
      description:
        "AI-планировщик учёбы с очередями приоритетов, динамическим расписанием и самосовершенствованием.",
    },
    "glasscube-portfolio": {
      name: "GlassCube Портфолио",
      description:
        "Это портфолио. Терминальная эстетика, мультиязычность, загрузочная анимация, стиль Tron.",
    },
    playwright: {
      name: "Playwright Демо",
      description: "Демо-приложение для тестирования возможностей Playwright.",
    },
    botanik: {
      name: "Botanik",
      description:
        "CLI-инструмент: читает код, автоматически создаёт и запускает тесты, генерирует документацию.",
    },
    financemate: {
      name: "ФинансПомощник",
      description:
        "Дашборд личных финансов: категоризация транзакций, аналитика расходов, отслеживание бюджета.",
    },
    music: {
      name: "Музыкальный плеер",
      description: "Плеер для воспроизведения музыки.",
    },
  },
};

export const PROJECTS: Project[] = [
  {
    id: "analytics",
    name: "Analytics",
    description:
      "a service for analyzing website or mobile application traffic, old one i made during junior year ",
    stack: ["TypeScript", "Bun.js", "Express", "Mongodb", "Memcached", "React"],
    status: "live",
    demo: "https://analytics.glasscube.uz",
    github: "https://github.com/nodiry/web-analytics",
    year: 2024,
  },
  {
    id: "hellostranger",
    name: "Hello Stranger Chat",
    description:
      "Random video chat — connect with strangers instantly. WebRTC-based, no accounts required. Privacy-first design.",
    stack: ["TypeScript", "WebRTC", "WebSocket", "React", "Vite", "Node.js"],
    status: "live",
    demo: "https://stranger.glasscube.uz",
    github: "https://github.com/nodiry/random-video-chat-demo",
    year: 2025,
  },
  {
    id: "chat",
    name: "Private Chat",
    description:
      "Private text chat — connect with a person instantly. Socket-based, no accounts required. Privacy-first design.",
    stack: ["TypeScript", "Socket.io", "React", "Vite", "Node.js"],
    status: "live",
    demo: "https://chat.glasscube.uz",
    github: "https://github.com/nodiry/chat-demo",
    year: 2026,
  },
  {
    id: "smart-scheduler",
    name: "Smart Study Scheduler",
    description:
      "AI-assisted task scheduling system with priority queues, Dynamic changes, and self improvement.",
    stack: ["TypeScript", "Elysia", "MongoDB", "React", "Memcached"],
    status: "live",
    demo: "https://study.glasscube.uz",
    github: "https://github.com/nodiry/smart-study-scheduler",
    year: 2024,
  },
  {
    id: "glasscube-portfolio",
    name: "GlassCube Portfolio",
    description:
      "This portfolio. Terminal-aesthetic developer portfolio with multi-language support, boot sequence, and Tron-inspired design.",
    stack: ["React", "ShadcnUI", "Vite", "Tailwind CSS"],
    status: "live",
    demo: "https://glasscube.uz",
    github: "https://github.com/glasscubeio/glasscube",
    year: 2026,
  },
  {
    id: "playwright",
    name: "Playwright demo",
    description:
      "Playwright demo — a simple web app that demonstrates Playwright's capabilities.",
    stack: ["React", "Playwright", "Express", "Vite", "Tailwind CSS"],
    status: "live",
    demo: "https://playwright.glasscube.uz",
    github: "https://github.com/nodiry/browser-screenshotter",
    year: 2026,
  },
  {
    id: "music",
    name: "Music player",
    description: "Playlist of my own music.",
    stack: ["React", "Playwright", "Express", "Vite", "Tailwind CSS"],
    status: "live",
    demo: "https://music.glasscube.uz",
    github: "https://github.com/nodiry/music",
    year: 2026,
  },
  {
    id: "botanik",
    name: "Botanik",
    description:
      "CLI Tool that reads the codebase and creates tests and runs the tests automatically and also provides docs. very useful for backend/frontend development.",
    stack: ["Bash", "TypeScript", "Bun.js", "LLM", "Claude"],
    status: "wip",
    demo: "https://botanik.glasscube.uz",
    github: "#",
    year: 2026,
  },
  {
    id: "financemate",
    name: "FinanceMate",
    description:
      "Personal finance tracking dashboard with transaction categorization, spending analytics, and budget goal tracking.",
    stack: ["TypeScript", "React", "Vite", "PostgreSQL", "Node.js", "Tailwind"],
    status: "archived",
    demo: "https://financemate.glasscube.uz",
    github: "https://github.com/nodiry/financemate",
    year: 2024,
  },
];
