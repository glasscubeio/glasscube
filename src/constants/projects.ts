import type { Lang } from "./translations";

export interface Project {
  id: string;
  name: string;
  description: string;
  stack: string[];
  img?: string;
  status: "live" | "wip" | "archived";
  github?: string;
  demo?: string;
  year: number;
}

export const PROJECT_CONTENT: Record<
  Lang,
  Record<string, { name: string; description: string }>
> = {
  en: {
    analytics: {
      name: "Analytics",
      description: "Web/mobile traffic analytics service from my junior year.",
    },
    hellostranger: {
      name: "Hello Stranger",
      description: "Anonymous WebRTC video chat with no signup required.",
    },
    chat: {
      name: "Private Chat",
      description: "Instant 1:1 text chat rooms using WebSockets.",
    },
    "smart-scheduler": {
      name: "AI Study Scheduler",
      description: "Smart task manager using dynamic priority queues.",
    },
    antiyoy: {
      name: "Antiyoy Game",
      description:
        "A 2D strategy turn based game where players compete against AI opponents.",
    },
    "qr-demo": {
      name: "QR Generator",
      description: "Quick custom QR code generation tool for links and text.",
    },
    "glasscube-portfolio": {
      name: "GlassCube Portfolio",
      description: "Terminal-styled multi-language personal portfolio.",
    },
    playwright: {
      name: "Playwright Demo",
      description: "Simple demo displaying web automation and testing.",
    },
    botanik: {
      name: "Botanik CLI",
      description: "CLI tool for automated test and documentation generation.",
    },
    financemate: {
      name: "FinanceMate",
      description:
        "Personal dashboard for budget goals and transaction tracking.",
    },
    music: {
      name: "Music Player",
      description: "Audio streaming player for personal music collections.",
    },
    algorithms: {
      name: "Algorithms",
      description:
        "Collection of algorithms and data structures with interactive visualizations.",
    },
    maze: {
      name: "FPS Maze Game",
      description:
        "First-person maze game featuring procedurally generated levels.",
    },
  },
  ko: {
    analytics: {
      name: "애널리틱스",
      description: "주니어 시절 제작한 웹·앱 트래픽 분석 서비스.",
    },
    hellostranger: {
      name: "헬로 스트레인저",
      description: "가입 없는 WebRTC 기반 익명 영상 채팅.",
    },
    chat: {
      name: "프라이빗 채팅",
      description: "소켓 기반의 익명 1:1 텍스트 채팅.",
    },
    "smart-scheduler": {
      name: "AI 스케줄러",
      description: "우선순위 큐 기반의 AI 학습 계획표.",
    },
    antiyoy: {
      name: "안티요이 게임",
      description: "인공지능(AI)과 경쟁하는 2D 턴제 전략 게임.",
    },
    "qr-demo": {
      name: "QR 생성기",
      description: "링크 및 텍스트 맞춤형 QR 코드 생성 도구.",
    },
    "glasscube-portfolio": {
      name: "글래스큐브",
      description: "터미널 감성과 다국어를 지원하는 포트폴리오.",
    },
    playwright: {
      name: "플레이라이트 데모",
      description: "웹 브라우저 자동화 및 테스트 기능 시연.",
    },
    botanik: {
      name: "보타닉 CLI",
      description: "코드 분석을 통한 자동 테스트 및 문서 생성 도구.",
    },
    financemate: {
      name: "파이낸스메이트",
      description: "자산 관리 및 거래 분석용 개인 재무 대시보드.",
    },
    music: {
      name: "뮤직 플레이어",
      description: "개인 음원 재생을 위한 오디오 플레이어.",
    },
    algorithms: {
      name: "알고리즘",
      description:
        "알고리즘과 자료구조를 시각적으로 학습할 수 있는 인터랙티브 컬렉션.",
    },
    maze: {
      name: "FPS 미로 게임",
      description: "절차적으로 생성된 미로를 탐험하는 1인칭 미로 게임.",
    },
  },
  uz: {
    analytics: {
      name: "Analytics",
      description: "Junior yilida yaratilgan veb va mobil trafik tahlili.",
    },
    hellostranger: {
      name: "Hello Stranger",
      description: "Ro'yxatdan o'tmasdan WebRTC tasodifiy video chat.",
    },
    chat: {
      name: "Maxfiy Chat",
      description: "Soketga asoslangan shaxsiy 1:1 matnli chat.",
    },
    "smart-scheduler": {
      name: "AI Rejalashtiruvchi",
      description: "Dinamik ustuvorlikka ega aqlli o'quv rejalashtiruvchi.",
    },
    antiyoy: {
      name: "Antiyoy O'yini",
      description:
        "O'yinchilar sun'iy intellektga (AI) qarshi bellashadigan 2D navbatli strategiya o'yini.",
    },
    "qr-demo": {
      name: "QR Generator",
      description: "Link va matnlar uchun QR kod yaratish vositasi.",
    },
    "glasscube-portfolio": {
      name: "GlassCube",
      description: "Terminal uslubidagi ko'p tilli portfolio.",
    },
    playwright: {
      name: "Playwright Demo",
      description: "Brauzer avtomatizatsiyasini ko'rsatuvchi demo ilova.",
    },
    botanik: {
      name: "Botanik CLI",
      description: "Avtomatik test va hujjat yaratuvchi CLI vositasi.",
    },
    financemate: {
      name: "Moliya Yordamchi",
      description: "Xarajatlar tahlili va shaxsiy moliya paneli.",
    },
    music: {
      name: "Musiqa Pleyer",
      description: "Shaxsiy musiqalarni tinglash uchun pleyer.",
    },
    algorithms: {
      name: "Algoritmlar",
      description:
        "Algoritmlar va ma'lumotlar tuzilmalarining interaktiv vizualizatsiyalari to'plami.",
    },
    maze: {
      name: "FPS Labirint O'yini",
      description:
        "Protsedurali yaratilgan labirintlarda harakatlanishga asoslangan FPS o'yini.",
    },
  },
  ru: {
    analytics: {
      name: "Аналитика",
      description: "Сервис аналитики трафика, созданный в студенческие годы.",
    },
    hellostranger: {
      name: "Hello Stranger",
      description: "Анонимный видеочат на WebRTC без регистрации.",
    },
    chat: {
      name: "Приватный Чат",
      description: "Мгновенный текстовый чат один на один на сокетах.",
    },
    "smart-scheduler": {
      name: "AI Планировщик",
      description: "Умное расписание учебы с очередью приоритетов.",
    },
    antiyoy: {
      name: "Игра Antiyoy",
      description:
        "Пошаговая 2D-стратегия, в которой игроки соревнуются с ИИ-противниками.",
    },
    "qr-demo": {
      name: "QR Генератор",
      description: "Утилита для генерации кастомных QR-кодов.",
    },
    "glasscube-portfolio": {
      name: "GlassCube",
      description: "Мультиязычное портфолио в стиле терминала.",
    },
    playwright: {
      name: "Playwright Демо",
      description: "Демонстрация автоматизации и тестирования сайтов.",
    },
    botanik: {
      name: "Botanik CLI",
      description: "CLI-инструмент для автогенерации тестов и документации.",
    },
    financemate: {
      name: "ФинансПомощник",
      description: "Личный финансовый дашборд для учета расходов.",
    },
    music: {
      name: "Музыкальный плеер",
      description: "Плеер для прослушивания личных треков.",
    },
    algorithms: {
      name: "Алгоритмы",
      description:
        "Коллекция алгоритмов и структур данных с интерактивной визуализацией.",
    },
    maze: {
      name: "FPS Лабиринт",
      description:
        "Игра от первого лица с исследованием процедурно генерируемого лабиринта.",
    },
  },
};

export const PROJECTS: Project[] = [
  {
    id: "analytics",
    name: "Analytics",
    description:
      "Web and mobile app traffic analytics service built during my junior year.",
    stack: ["TypeScript", "Bun.js", "Express", "Mongodb", "Memcached", "React"],
    status: "live",
    img: "/screenshots/analytics.png",
    demo: "https://analytics.glasscube.uz",
    github: "https://github.com/nodiry/web-analytics",
    year: 2024,
  },
  {
    id: "hellostranger",
    name: "Hello Stranger",
    description:
      "Account-free random video chat built on WebRTC with privacy-first design.",
    stack: ["TypeScript", "WebRTC", "WebSocket", "React", "Vite", "Node.js"],
    status: "live",
    img: "/screenshots/video.png",
    demo: "https://stranger.glasscube.uz",
    github: "https://github.com/nodiry/random-video-chat-demo",
    year: 2025,
  },
  {
    id: "chat",
    name: "Private Chat",
    description: "Instant 1:1 anonymous text chat powered by Socket.io.",
    stack: ["TypeScript", "Socket.io", "React", "Vite", "Node.js"],
    status: "live",
    img: "/screenshots/chat.png",
    demo: "https://chat.glasscube.uz",
    github: "https://github.com/nodiry/chat-demo",
    year: 2026,
  },
  {
    id: "smart-scheduler",
    name: "AI Study Scheduler",
    description:
      "AI-assisted task scheduling with dynamic adjustment and priority queues.",
    stack: ["TypeScript", "Elysia", "MongoDB", "React", "Memcached"],
    status: "live",
    img: "/screenshots/study.png",
    demo: "https://study.glasscube.uz",
    github: "https://github.com/nodiry/smart-study-scheduler",
    year: 2024,
  },
  {
    id: "antiyoy",
    name: "Antiyoy Game",
    description:
      "A 2D strategy turn based game where players compete against AI opponents.",
    stack: ["TypeScript", "React", "Bun", "Tailwind CSS", "ShadcnUI"],
    status: "live",
    img: "/screenshots/antiyoy.png",
    demo: "https://antiyoy.glasscube.uz",
    github: "https://github.com/nodiry/web-antiyoy",
    year: 2026,
  },
  {
    id: "qr-demo",
    name: "QR Generator",
    description: "Customizable QR code generator for any URL or text input.",
    stack: ["TypeScript", "React", "Vite", "Tailwind CSS"],
    status: "live",
    img: "/screenshots/qr.png",
    demo: "https://qr.glasscube.uz",
    github: "https://github.com/nodiry/qr-demo",
    year: 2024,
  },
  {
    id: "glasscube-portfolio",
    name: "GlassCube",
    description:
      "Terminal-aesthetic portfolio with multi-language support and Tron design.",
    stack: ["React", "ShadcnUI", "Vite", "Tailwind CSS"],
    status: "live",
    img: "/screenshots/portfolio.png",
    demo: "https://glasscube.uz",
    github: "https://github.com/glasscubeio/glasscube",
    year: 2026,
  },
  {
    id: "algorithms",
    name: "Algorithms",
    description:
      "A collection of algorithms and data structures visualized implemented in TypeScript.",
    stack: ["React", "ShadcnUI", "Vite", "Tailwind CSS"],
    status: "live",
    img: "/screenshots/algorithm.png",
    demo: "https://algorithm.glasscube.uz",
    github: "https://github.com/glasscubeio/algorithms",
    year: 2025,
  },
  {
    id: "playwright",
    name: "Playwright Demo",
    description:
      "A straightforward web application showcasing Playwright's automation capabilities.",
    stack: ["React", "Playwright", "Express", "Vite", "Tailwind CSS"],
    status: "live",
    img: "/screenshots/playwright.png",
    demo: "https://playwright.glasscube.uz",
    github: "https://github.com/nodiry/browser-screenshotter",
    year: 2026,
  },
  {
    id: "music",
    name: "Music Player",
    description:
      "A custom personal audio player to stream my own music playlist.",
    stack: ["React", "Playwright", "Express", "Vite", "Tailwind CSS"],
    status: "live",
    img: "/screenshots/music.png",
    demo: "https://music.glasscube.uz",
    github: "https://github.com/nodiry/music",
    year: 2026,
  },
  {
    id: "botanik",
    name: "Botanik CLI",
    description:
      "CLI tool that parses codebases to auto-generate tests and documentation.",
    stack: ["Bash", "TypeScript", "Bun.js", "LLM", "Claude"],
    status: "wip",
    github: "#",
    year: 2026,
  },
  {
    id: "maze",
    name: "FPS Maze Game",
    description:
      "FPS maze game where player navigates through a procedurally generated maze.",
    stack: ["OpenGL", "Python3"],
    status: "archived",
    github: "https://github.com/nodiry/maze_game",
    year: 2024,
  },
  {
    id: "financemate",
    name: "FinanceMate",
    description:
      "Personal finance dashboard featuring transaction tracking and spending analytics.",
    stack: ["TypeScript", "React", "Vite", "PostgreSQL", "Node.js", "Tailwind"],
    status: "archived",
    github: "https://github.com/nodiry/financemate",
    year: 2024,
  },
];
