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
  dark: { en: "Dark", ko: "다크" },
  light: { en: "Light", ko: "라이트" },
  cvEn: { en: "CV (English)", ko: "영문 CV" },
  cvKo: { en: "이력서 (Korean)", ko: "국문 이력서" },
} satisfies Record<string, L>;

export const KEYWORDS = ["Payments", "Web3", "FastAPI", "React", "AWS"];

export const CV = {
  en: "/cv/Nodirbek_Bokiev_CV.docx",
  ko: "/cv/Nodirbek_Bokiev_Iryeokseo.docx",
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
        en: "Backend mostly in FastAPI (about 80%), plus Spring Boot and NestJS. UIs in React and Vite.",
        ko: "백엔드는 주로 FastAPI(약 80%), Spring Boot, NestJS. 프론트엔드는 React, Vite.",
      },
    ],
    stack: [
      "Python",
      "FastAPI",
      "Spring Boot",
      "NestJS",
      "React",
      "Toss",
      "Polar",
      "USDC",
    ],
    start: "2026-07",
  },
  {
    company: "TARMOQDA",
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
    stack: ["TypeScript", "Express", "React", "Vite"],
    start: "2025-12",
    end: "2026-07",
  },
  {
    company: "SRZ MEMOR",
    role: { en: "Full-Stack Developer", ko: "풀스택 개발자" },
    type: { en: "Part-time", ko: "파트타임" },
    place: {
      en: "Namangan, Uzbekistan · Remote",
      ko: "우즈베키스탄 나망간 · 원격",
    },
    bullets: [
      {
        en: "Built the company website and an internal platform for a construction materials manufacturer.",
        ko: "건설 자재 제조사의 회사 웹사이트와 사내 플랫폼 개발.",
      },
    ],
    stack: ["TypeScript", "Express", "React"],
    start: "2025-03",
    end: "2025-11",
  },
];

export const PROJECTS: {
  name: string;
  tag: L;
  description: L;
  stack: string[];
  demo: string;
  github: string;
}[] = [
  {
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
];

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
