export type Lang = "en" | "ko";
export type L = Record<Lang, string>;

export const LANGS: Record<Lang, string> = { en: "EN", ko: "한국어" };

export const UI = {
  name: { en: "Nodirbek Bokiev", ko: "보키예프 노디르벡" },
  title: { en: "Full-Stack Developer", ko: "풀스택 개발자" },
  summary: {
    en: "I build marketplace and platform backends with TypeScript, Python and Java. Currently building a marketplace that runs on both conventional payments and Ethereum stablecoins.",
    ko: "TypeScript, Python, Java로 마켓플레이스와 플랫폼 백엔드를 개발합니다. 현재 기존 결제와 이더리움 스테이블코인을 함께 지원하는 마켓플레이스를 개발하고 있습니다.",
  },
  location: {
    en: "Busan, South Korea · Open to opportunities",
    ko: "부산 · 새로운 기회에 열려 있습니다",
  },
  experience: { en: "Experience", ko: "경력" },
  work: { en: "Selected work", ko: "프로젝트" },
  skills: { en: "Skills", ko: "기술" },
  education: { en: "Education", ko: "학력" },
  present: { en: "Present", ko: "현재" },
  demo: { en: "Live", ko: "데모" },
  code: { en: "Code", ko: "코드" },
  dark: { en: "Dark", ko: "다크" },
  light: { en: "Light", ko: "라이트" },
} satisfies Record<string, L>;

export const CONTACT = [
  { label: "worknadir95@gmail.com", href: "mailto:worknadir95@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nodirbek-bokiev" },
  { label: "GitHub", href: "https://github.com/nodiry" },
  { label: "Telegram", href: "https://t.me/RBNNB" },
];

export const EXPERIENCE: {
  company: string;
  role: L;
  type: L;
  place: L;
  summary: L;
  start: string;
  end?: string;
}[] = [
  {
    company: "Circular Solution",
    role: { en: "Platform Developer", ko: "플랫폼 개발자" },
    type: { en: "Full-time", ko: "정규직" },
    place: { en: "Busan, South Korea · On-site", ko: "부산 · 상주" },
    summary: {
      en: "Building a marketplace that supports both conventional finance and Ethereum stablecoin payments, with encryption and Eclipse Dataspace Components.",
      ko: "기존 금융과 이더리움 스테이블코인 결제를 함께 지원하는 마켓플레이스 개발. 암호화 및 Eclipse Dataspace Components 적용.",
    },
    start: "2026-07",
  },
  {
    company: "TARMOQDA",
    role: { en: "Full-Stack Engineer", ko: "풀스택 엔지니어" },
    type: { en: "Full-time", ko: "정규직" },
    place: { en: "Uzbekistan · Remote", ko: "우즈베키스탄 · 원격" },
    summary: {
      en: "Built a job posting platform end to end, focused on the backend and APIs consumed by the mobile app team.",
      ko: "채용 공고 플랫폼을 풀스택으로 개발. 모바일 앱 팀이 사용하는 백엔드와 API 개발에 집중.",
    },
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
    summary: {
      en: "Built the company website and an internal platform for a construction materials manufacturer.",
      ko: "건설 자재 제조사의 회사 웹사이트와 사내 플랫폼 개발.",
    },
    start: "2025-03",
    end: "2025-11",
  },
];

export const PROJECTS: {
  name: L;
  description: L;
  stack: string[];
  demo: string;
  github: string;
}[] = [
  {
    name: { en: "Crypto Wallet", ko: "암호화폐 지갑" },
    description: {
      en: "Wallet for managing digital assets securely.",
      ko: "디지털 자산을 안전하게 관리하는 암호화폐 지갑.",
    },
    stack: ["TypeScript", "Elysia", "MongoDB", "Memcached", "React"],
    demo: "https://wallet.glasscube.uz",
    github: "https://github.com/nodiry/wallet",
  },
  {
    name: { en: "Analytics", ko: "애널리틱스" },
    description: {
      en: "Web and mobile app traffic analytics service.",
      ko: "웹·앱 트래픽 분석 서비스.",
    },
    stack: ["TypeScript", "Bun", "Express", "MongoDB", "Memcached", "React"],
    demo: "https://analytics.glasscube.uz",
    github: "https://github.com/nodiry/web-analytics",
  },
  {
    name: { en: "Hello Stranger", ko: "헬로 스트레인저" },
    description: {
      en: "Account-free random video chat over WebRTC.",
      ko: "가입 없는 WebRTC 기반 랜덤 영상 채팅.",
    },
    stack: ["TypeScript", "WebRTC", "WebSocket", "Node.js", "React"],
    demo: "https://stranger.glasscube.uz",
    github: "https://github.com/nodiry/random-video-chat-demo",
  },
  {
    name: { en: "AI Study Scheduler", ko: "AI 학습 스케줄러" },
    description: {
      en: "Task scheduling with dynamic priority queues.",
      ko: "동적 우선순위 큐 기반 학습 일정 관리.",
    },
    stack: ["TypeScript", "Elysia", "MongoDB", "Memcached", "React"],
    demo: "https://study.glasscube.uz",
    github: "https://github.com/nodiry/smart-study-scheduler",
  },
];

export const SKILLS: { title: L; items: string[] }[] = [
  {
    title: { en: "Languages", ko: "언어" },
    items: ["TypeScript", "Python", "Java", "Rust"],
  },
  {
    title: { en: "Backend", ko: "백엔드" },
    items: [
      "Bun",
      "Fastify",
      "Express",
      "FastAPI",
      "Spring Boot",
      "Go Fiber",
      "Actix",
    ],
  },
  {
    title: { en: "Frontend", ko: "프론트엔드" },
    items: ["React", "Next.js", "Vite", "Tailwind CSS"],
  },
  {
    title: { en: "Web3 & Dataspaces", ko: "Web3 & 데이터스페이스" },
    items: [
      "Ethereum",
      "Stablecoins",
      "Eclipse Dataspace Components",
      "Encryption",
    ],
  },
  {
    title: { en: "Databases", ko: "데이터베이스" },
    items: ["PostgreSQL", "MongoDB", "Redis", "Valkey", "Memcached"],
  },
  {
    title: { en: "APIs", ko: "API" },
    items: ["REST", "gRPC", "WebSocket"],
  },
  {
    title: { en: "Infra & Tools", ko: "인프라 & 도구" },
    items: ["Docker", "Linux", "Git", "CI/CD", "Neovim"],
  },
  {
    title: { en: "Architecture", ko: "아키텍처" },
    items: ["Microservices", "Event-Driven", "DDD", "Design Patterns (GoF)"],
  },
];

export const EDUCATION = {
  school: { en: "Dongseo University", ko: "동서대학교" },
  degree: { en: "Computer Science", ko: "컴퓨터공학" },
  place: { en: "Busan, South Korea", ko: "부산" },
};
