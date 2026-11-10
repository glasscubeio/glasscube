export type Lang = "en" | "ko";
export type L = Record<Lang, string>;

export const LANGS: Record<Lang, string> = { en: "EN", ko: "한국어" };

export const UI = {
  name: { en: "Nodirbek Bokiev", ko: "보키예프 노디르벡" },
  title: { en: "Full-Stack Developer", ko: "풀스택 개발자" },
  status: { en: "Open to opportunities", ko: "구직 중" },
  experience: { en: "Experience", ko: "경력" },
  work: { en: "Selected work", ko: "프로젝트" },
  skills: { en: "Skills", ko: "기술" },
  education: { en: "Education", ko: "학력" },
  present: { en: "Present", ko: "현재" },
  demo: { en: "Live", ko: "데모" },
  code: { en: "Code", ko: "코드" },
  back: { en: "Back", ko: "뒤로" },
  next: { en: "Next project", ko: "다음 프로젝트" },
  viewAll: { en: "View all", ko: "전체 보기" },
  allProjects: { en: "All projects", ko: "전체 프로젝트" },
  dark: { en: "Dark", ko: "다크" },
  light: { en: "Light", ko: "라이트" },
  cvEn: { en: "CV (English)", ko: "영문 CV" },
  cvKo: { en: "이력서 (Korean)", ko: "국문 이력서" },
} satisfies Record<string, L>;

export const KEYWORDS = ["Payments", "Web3", "FastAPI", "React", "AWS"];

export const CV = {
  en: "/cv/Nodirbek_Bokiev_CV.pdf",
  ko: "/cv/Nodirbek_Bokiev_Iryeokseo.pdf",
};

export const CONTACT = [
  { label: "worknadir95@gmail.com", href: "mailto:worknadir95@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nodirbek-bokiev" },
  { label: "GitHub", href: "https://github.com/nodiry" },
  { label: "Telegram", href: "https://t.me/RBNNB" },
];

export const EXPERIENCE: {
  company: string;
  url?: string;
  role: L;
  type: L;
  place: L;
  bullets: L[];
  stack: string[];
  start: string;
  end?: string;
}[] = [
  {
    company: "Circular Solution",
    url: "https://circularsolution.net",
    role: { en: "Full-Stack Platform Developer", ko: "풀스택 플랫폼 개발자" },
    type: { en: "Full-time", ko: "풀타임" },
    place: { en: "Busan, South Korea · On-site", ko: "부산 · 상주" },
    bullets: [
      {
        en: "Integrated Toss Payments and Polar across 4+ company platforms, covering subscriptions and one-time payments end to end.",
        ko: "회사 플랫폼 4곳 이상에 Toss Payments와 Polar를 연동해 구독 및 단건 결제 전 과정을 구현.",
      },
      {
        en: "Built USDC stablecoin payments for B2B trade on the company marketplace, with MoonPay for fiat ramping.",
        ko: "회사 마켓플레이스의 B2B 거래용 USDC 스테이블코인 결제를 개발하고 MoonPay 램프를 연동.",
      },
      {
        en: "Built backend services in FastAPI, Spring Boot and NestJS, with React frontends.",
        ko: "FastAPI, Spring Boot, NestJS로 백엔드 서비스를, React로 프론트엔드를 개발.",
      },
    ],
    stack: [
      "Python",
      "FastAPI",
      "Spring Boot",
      "NestJS",
      "Toss",
      "Polar",
      "USDC",
    ],
    start: "2026-07",
  },
  {
    company: "TARMOQDA",
    url: "https://tarmoqda.uz",
    role: { en: "Full-Stack Engineer", ko: "풀스택 엔지니어" },
    type: { en: "Full-time", ko: "풀타임" },
    place: { en: "Uzbekistan · Remote", ko: "우즈베키스탄 · 원격" },
    bullets: [
      {
        en: "Built a job posting platform end to end and owned the backend and APIs used by the mobile team.",
        ko: "채용 공고 플랫폼을 풀스택으로 개발하고 모바일 팀이 사용하는 백엔드와 API를 담당.",
      },
      {
        en: "Integrated Hamkorbank card payments.",
        ko: "Hamkorbank(우즈베키스탄 은행) 카드 결제 연동.",
      },
    ],
    stack: [
      "TypeScript",
      "Express",
      "Memcached",
      "HamkorBank integration",
      "React",
    ],
    start: "2025-12",
    end: "2026-07",
  },
  {
    company: "SRZ MEMOR",
    url: "https://srzmemor.uz",
    role: { en: "Full-Stack Developer", ko: "풀스택 개발자" },
    type: { en: "Part-time", ko: "파트타임" },
    place: {
      en: "Namangan, Uzbekistan · Remote",
      ko: "우즈베키스탄 나망간 · 원격",
    },
    bullets: [
      {
        en: "Built and maintained the company website for a construction materials manufacturer.",
        ko: "건설 자재 제조사의 회사 웹사이트 개발 및 유지보수.",
      },
      {
        en: "Built and maintained custom internal tools for the company.",
        ko: "회사 내부용 맞춤 도구 개발 및 유지보수.",
      },
    ],
    stack: ["TypeScript", "Electron", "Memcached", "Express", "React"],
    start: "2025-03",
    end: "2025-11",
  },
];

export type Details = {
  facts?: { label: L; value: L }[];
  sections?: {
    title: L;
    body?: L[];
    images?: { src: string; caption?: L }[];
  }[];
};

export const PROJECTS: {
  slug: string;
  name: string;
  featured?: boolean;
  tag?: L;
  description: L;
  stack: string[];
  demo?: string;
  github: string;
  details?: Details;
}[] = [
  {
    slug: "breeze",
    featured: true,
    name: "Breeze",
    tag: { en: "3rd place · DIVE 2025", ko: "DIVE 2025 3위" },
    description: {
      en: "Smartwatch app for safety at sea: tap-to-call emergency, typhoon alerts and AI fishing advice. I led the team.",
      ko: "해상 안전 스마트워치 앱: 탭 긴급 호출, 태풍 경보, AI 낚시 분석. 팀장으로 참여.",
    },
    stack: ["Swift", "SwiftUI", "Kotlin", "Gemini", "HealthKit"],
    github: "https://github.com/nodiry/DIVE2025",
  },
  {
    slug: "smartscheduler",
    featured: true,
    name: "SmartScheduler",
    tag: { en: "Award-winning paper", ko: "논문상 수상" },
    description: {
      en: "Graduation project: webcam focus tracking and adaptive study plans.",
      ko: "졸업 프로젝트: 웹캠 집중도 추적과 맞춤형 학습 일정.",
    },
    stack: [
      "TypeScript",
      "React",
      "MediaPipe",
      "Three.js",
      "Express",
      "MongoDB",
    ],
    demo: "https://study.glasscube.uz",
    github: "https://github.com/nodiry/smart-study-scheduler",
  },
  {
    slug: "usdc-wallet",
    featured: true,
    name: "USDC Wallet",
    tag: { en: "Testnet demo", ko: "테스트넷 데모" },
    description: {
      en: "USDC wallet on Base with gasless transfers and a MoonPay on-ramp.",
      ko: "가스리스 송금과 MoonPay 온램프를 갖춘 Base USDC 지갑.",
    },
    stack: [
      "TypeScript",
      "Express",
      "MongoDB",
      "viem",
      "Coinbase CDP",
      "React",
    ],
    demo: "https://wallet.glasscube.uz",
    github: "https://github.com/nodiry/wallet",
  },
  {
    slug: "secure-chat",
    featured: true,
    name: "Secure Chat",
    tag: { en: "Used by my team", ko: "팀 내 실사용" },
    description: {
      en: "End-to-end encrypted chat that stores nothing. My team shares credentials on it.",
      ko: "아무것도 저장하지 않는 종단간 암호화 채팅. 팀 내 계정 공유용으로 사용 중.",
    },
    stack: ["TypeScript", "Bun", "Socket.io", "Web Crypto", "React"],
    demo: "https://chat.glasscube.uz",
    github: "https://github.com/nodiry/chat-demo",
  },
  {
    slug: "qr-studio",
    name: "QR Studio",
    tag: { en: "In regular use", ko: "실사용 중" },
    description: {
      en: "Custom QR codes with logos and gradients. Stores nothing.",
      ko: "로고와 그라디언트를 지원하는 QR 생성기. 저장 없음.",
    },
    stack: ["TypeScript", "Bun", "React"],
    demo: "https://qr.glasscube.uz",
    github: "https://github.com/nodiry/qr-demo",
  },
  {
    slug: "algorithm-visualizer",
    name: "Algorithm Visualizer",
    description: {
      en: "Step through 19 algorithms with animations and synced code in TypeScript, Rust and Java.",
      ko: "19개 알고리즘을 애니메이션과 TypeScript·Rust·Java 코드 하이라이트로 단계별 학습.",
    },
    stack: ["TypeScript", "React", "Framer Motion"],
    demo: "https://algorithm.glasscube.uz",
    github: "https://github.com/nodiry/algorithms",
  },
  {
    slug: "hello-stranger",
    name: "Hello Stranger",
    description: {
      en: "Anonymous random video chat over WebRTC. No accounts, no history.",
      ko: "WebRTC 기반 익명 랜덤 영상 채팅. 계정과 기록 없음.",
    },
    stack: ["TypeScript", "WebRTC", "WebSocket", "Node.js", "React"],
    demo: "https://stranger.glasscube.uz",
    github: "https://github.com/nodiry/random-video-chat-demo",
  },
  {
    slug: "analytics",
    name: "Analytics",
    tag: { en: "Archived", ko: "보관됨" },
    description: {
      en: "Self-hostable web analytics: add one script tag, get a full dashboard.",
      ko: "스크립트 한 줄로 쓰는 셀프 호스팅 웹 분석 대시보드.",
    },
    stack: ["TypeScript", "Bun", "Elysia", "MongoDB", "React"],
    demo: "https://analytics.glasscube.uz",
    github: "https://github.com/nodiry/web-analytics",
  },
  {
    slug: "music-player",
    name: "Music Player",
    description: {
      en: "Minimal music player with smooth transitions and keyboard controls.",
      ko: "부드러운 전환과 키보드 조작을 지원하는 미니멀 뮤직 플레이어.",
    },
    stack: ["React", "Bun", "Framer Motion"],
    demo: "https://music.glasscube.uz",
    github: "https://github.com/nodiry/music",
  },
  {
    slug: "antiyoy",
    name: "Antiyoy",
    tag: { en: "Browser port", ko: "브라우저 포팅" },
    description: {
      en: "Browser port of yiotro's hex strategy game, with AI opponents and mobile support.",
      ko: "yiotro의 헥스 전략 게임 Antiyoy 브라우저 포팅. AI 상대와 모바일 지원.",
    },
    stack: ["TypeScript", "React", "Bun"],
    demo: "https://antiyoy.glasscube.uz",
    github: "https://github.com/nodiry/web-antiyoy",
  },
];

export const FEATURED = PROJECTS.filter((p) => p.featured);

export const SKILLS: { title: L; items: string[] }[] = [
  {
    title: { en: "Payments", ko: "결제" },
    items: ["Toss Payments", "Polar", "Hamkorbank", "MoonPay"],
  },
  {
    title: { en: "Web3", ko: "Web3" },
    items: ["Ethereum", "USDC", "Circle", "Coinbase CDP"],
  },
  {
    title: { en: "AI Integration", ko: "AI 연동" },
    items: ["Gemini", "DeepSeek", "Ollama"],
  },
  {
    title: { en: "Languages", ko: "언어" },
    items: ["Python", "TypeScript", "Java"],
  },
  {
    title: { en: "Backend", ko: "백엔드" },
    items: ["FastAPI", "Spring Boot", "NestJS", "Express"],
  },
  {
    title: { en: "Frontend", ko: "프론트엔드" },
    items: ["React", "Vue.js"],
  },
  {
    title: { en: "Infra & Tools", ko: "인프라 & 도구" },
    items: [
      "AWS (EC2, S3, Lambda, CloudFront, Route 53, Lightsail)",
      "Kubernetes",
      "Docker",
      "GitLab CI/CD",
      "Linux",
    ],
  },
  {
    title: { en: "Databases", ko: "데이터베이스" },
    items: ["PostgreSQL", "MongoDB", "Redis", "Memcached"],
  },
  {
    title: { en: "APIs", ko: "API" },
    items: ["REST", "WebSocket"],
  },
];

export const EDUCATION = {
  school: { en: "Dongseo University", ko: "동서대학교" },
  degree: { en: "Computer Science", ko: "컴퓨터공학" },
  place: { en: "Busan, South Korea", ko: "부산" },
  start: "2021",
  end: "2025",
};
