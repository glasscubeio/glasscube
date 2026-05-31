export type Lang = "en" | "ko" | "uz" | "ru";

export const TABS = ["Home", "Projects", "About", "Skills", "Contact"] as const;
export type Tab = (typeof TABS)[number];

export const STATUS_LABELS: Record<Lang, Record<"live" | "wip" | "archived", string>> = {
  en: { live: "LIVE",       wip: "WIP",          archived: "ARCHIVED"     },
  ko: { live: "LIVE",       wip: "개발중",         archived: "아카이브"      },
  uz: { live: "JONLI",      wip: "ISHLANMOQDA",  archived: "ARXIV"        },
  ru: { live: "LIVE",       wip: "В РАЗР.",       archived: "АРХИВ"        },
};

export const HOME_CONTENT: Record<
  Lang,
  {
    greeting: string;
    name: string;
    title: string;
    location: string;
    role: string;
    available: string;
    education: string;
    since: string;
    prompt: string;
    resumeBtn: string;
    coverLetterBtn: string;
    openFor: string;
  }
> = {
  en: {
    greeting: "Welcome to my portfolio",
    name: "BOKIEV NODIRBEK",
    title: "Fullstack Developer & System Architect",
    location: "Busan, South Korea",
    role: "Fullstack Developer @ Tarmoqda",
    available: "Open to Remote / Worldwide",
    education: "Dongseo University — Computer Science",
    since: "Engineering since 2025",
    prompt: "boot@glasscube:~$",
    resumeBtn: "Download Resume",
    coverLetterBtn: "Cover Letter",
    openFor: "Open for opportunities",
  },
  ko: {
    greeting: "포트폴리오에 오신 것을 환영합니다",
    name: "보키예프 노디르벡",
    title: "풀스택 개발자 & 시스템 아키텍트",
    location: "부산, 대한민국",
    role: "풀스택 개발자 @ Tarmoqda",
    available: "재택 / 전세계 가능",
    education: "동서대학교 — 컴퓨터공학",
    since: "2025년부터 개발 중",
    prompt: "boot@glasscube:~$",
    resumeBtn: "이력서 다운로드",
    coverLetterBtn: "자기소개서",
    openFor: "기회 탐색 중",
  },
  uz: {
    greeting: "Portfoliomga xush kelibsiz",
    name: "BOKIEV NODIRBEK",
    title: "Fullstack Dasturchi & Sistema Arxitektori",
    location: "Busan, Janubiy Koreya",
    role: "Fullstack Dasturchi @ Tarmoqda",
    available: "Masofaviy / Global",
    education: "Dongseo Universiteti — Kompyuter Fanlari",
    since: "2025-yildan beri dasturlash",
    prompt: "boot@glasscube:~$",
    resumeBtn: "Rezyume yuklab olish",
    coverLetterBtn: "Motivatsiya xat",
    openFor: "Imkoniyatlarga ochiq",
  },
  ru: {
    greeting: "Добро пожаловать в моё портфолио",
    name: "БОКИЕВ НОДИРБЕК",
    title: "Fullstack Разработчик & Системный Архитектор",
    location: "Пусан, Южная Корея",
    role: "Fullstack Разработчик @ Tarmoqda",
    available: "Удалённая / Мировая занятость",
    education: "Университет Донгсо — Компьютерные науки",
    since: "В разработке с 2025 года",
    prompt: "boot@glasscube:~$",
    resumeBtn: "Скачать резюме",
    coverLetterBtn: "Сопр. письмо",
    openFor: "Открыт к предложениям",
  },
};

export const ABOUT_LINES: Record<Lang, string[]> = {
  en: [
    "> cat about.md",
    "",
    "# Nodirbek Bokiev",
    "",
    "Backend engineer obsessed with system performance, control, and clean structure.",
    "Started in 2020 with Kotlin — a broken calculator that couldn't divide was my first project.",
    "Since then: minimalism, brutalist architecture, and hands-on experimentation.",
    "",
    "## Philosophy",
    "Backend development gives me control. From orchestrating complex APIs to handling",
    "terabytes of data — it's discipline meets creativity. If not in tech, I'd be an architect.",
    "Structure and brutalism attract me.",
    "",
    "## Education & Career",
    "Dongseo University — Computer Science, Busan.",
    "Currently: Fullstack Developer at Tarmoqda (Uzbek construction-tech).",
    "",
    "## Learning Path",
    "Almost everything I know came from building. CodeWithMosh helped with foundations",
    "(React, Node, SQL, DSA), but real growth came from shipping real systems.",
    "Gang of Four changed how I think about architecture.",
    "No paradigm fits all — knowing when to use what is the actual skill.",
    "",
    "## Stack Evolution",
    "Started: Node.js + Next.js + Redis",
    "Now:     Bun + Vite + Memcached — faster, leaner, more control.",
    "",
    "## Workflow",
    "Neovim in terminal. Ubuntu/Debian on servers.",
    "Planning to explore RHEL for its robustness.",
    "",
    "> _",
  ],
  ko: [
    "> cat about.md",
    "",
    "# 보키예프 노디르벡",
    "",
    "시스템 성능과 구조를 중시하는 백엔드 엔지니어.",
    "2020년 Kotlin으로 시작 — 나누기 안 되는 계산기가 첫 프로젝트였습니다.",
    "이후: 미니멀리즘, 구조주의, 실험적 개발.",
    "",
    "## 철학",
    "백엔드 개발은 제어를 가능하게 합니다. 복잡한 API와 TB 단위 데이터 처리 —",
    "규율과 창의성의 만남. IT가 없었다면 건축가가 되었을 겁니다.",
    "",
    "## 학력 & 경력",
    "동서대학교 — 컴퓨터공학, 부산.",
    "현재: Tarmoqda에서 풀스택 개발자 (우즈베키스탄 건설 테크).",
    "",
    "## 학습 방식",
    "실제 프로젝트를 통해 대부분의 기술을 습득했습니다.",
    "Gang of Four는 아키텍처 사고 방식을 바꿔줬습니다.",
    "",
    "## 스택 진화",
    "시작: Node.js + Next.js + Redis",
    "현재: Bun + Vite + Memcached — 더 빠르고, 더 가볍고, 더 직접적.",
    "",
    "> _",
  ],
  uz: [
    "> cat about.md",
    "",
    "# Nodirbek Bokiev",
    "",
    "Tizim samaradorligi va nazoratni sevuvchi backend dasturchiman.",
    "2018-yilda Kotlin bilan boshladim — bo'linmaydigan kalkulyator birinchi loyiham edi.",
    "Shundan beri: minimalizm, brutalizm va amaliy tajriba.",
    "",
    "## Falsafam",
    "Backend nazoratni beradi. Murakkab API'lar va TB'lik ma'lumotlar bilan ishlash —",
    "bu tartib va ijodiyotning tutashgan joyi. IT bo'lmaganida, arxitektor bo'lardim.",
    "",
    "## Ta'lim & Ish",
    "Dongseo Universiteti — Kompyuter Fanlari, Busan.",
    "Hozir: SRZ Memor'da Fullstack Dasturchi.",
    "",
    "## O'rganish yo'li",
    "Ko'pchilik ko'nikmalarimni loyiha qurishdan oldim.",
    "Gang of Four kitobim arxitektura fikrlashimni o'zgartirdi.",
    "",
    "## Stack evolyutsiyasi",
    "Boshlanish: Node.js + Next.js + Redis",
    "Hozir:      Bun + Vite + Memcached — tezroq, yengilroq.",
    "",
    "> _",
  ],
  ru: [
    "> cat about.md",
    "",
    "# Нодирбек Бокиев",
    "",
    "Backend-инженер, увлечённый производительностью и чистой архитектурой.",
    "Начал в 2020 с Kotlin — первый проект: калькулятор без деления.",
    "С тех пор: минимализм, брутализм и практические эксперименты.",
    "",
    "## Философия",
    "Backend даёт мне контроль. Сложные API, терабайты данных —",
    "это дисциплина и творчество одновременно. Не в IT — был бы архитектором.",
    "",
    "## Образование & Карьера",
    "Университет Донгсо — Компьютерные науки, Пусан.",
    "Сейчас: Fullstack разработчик в Tarmoqda.",
    "",
    "## Путь обучения",
    "Большинство навыков — из реальных проектов.",
    "Gang of Four изменила мой подход к архитектуре.",
    "",
    "## Эволюция стека",
    "Начало: Node.js + Next.js + Redis",
    "Сейчас: Bun + Vite + Memcached — быстрее, легче.",
    "",
    "> _",
  ],
};

export const CONTACT_DATA: Record<
  Lang,
  {
    heading: string;
    subheading: string;
    items: { label: string; value: string; href?: string }[];
    social: { label: string; href: string }[];
  }
> = {
  en: {
    heading: "Get in Touch",
    subheading: "Available for remote work and collaborations worldwide.",
    items: [
      {
        label: "Email",
        value: "worknadir95@gmail.com",
        href: "mailto:worknadir95@gmail.com",
      },
      {
        label: "Phone",
        value: "+82 (10) 8173 7778",
        href: "tel:+821081737778",
      },
      { label: "Location", value: "Sasang, Busan — Remote OK" },
      { label: "Response", value: "Within 24 hours" },
    ],
    social: [
      { label: "GitHub", href: "https://github.com/nodiry" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/nodirbek-bokiev",
      },
      { label: "Telegram", href: "https://t.me/RBNNB" },
    ],
  },
  ko: {
    heading: "연락하기",
    subheading: "재택 근무 및 전 세계 협업 가능합니다.",
    items: [
      {
        label: "이메일",
        value: "worknadir95@gmail.com",
        href: "mailto:worknadir95@gmail.com",
      },
      {
        label: "전화번호",
        value: "+82 (10) 8173 7778",
        href: "tel:+821081737778",
      },
      { label: "위치", value: "부산 사상구 — 재택 가능" },
      { label: "응답 시간", value: "보통 24시간 이내" },
    ],
    social: [
      { label: "GitHub", href: "https://github.com/nodiry" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/nodirbek-bokiev",
      },
      { label: "Telegram", href: "https://t.me/RBNNB" },
    ],
  },
  uz: {
    heading: "Bog'lanish",
    subheading: "Masofaviy ish va global hamkorlik uchun mavjudman.",
    items: [
      {
        label: "Email",
        value: "worknadir95@gmail.com",
        href: "mailto:worknadir95@gmail.com",
      },
      {
        label: "Telefon",
        value: "+82 (10) 8173 7778",
        href: "tel:+821081737778",
      },
      { label: "Manzil", value: "Busan, Janubiy Koreya — Masofaviy OK" },
      { label: "Javob vaqti", value: "24 soat ichida" },
    ],
    social: [
      { label: "GitHub", href: "https://github.com/nodiry" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/nodirbek-bokiev",
      },
      { label: "Telegram", href: "https://t.me/RBNNB" },
    ],
  },
  ru: {
    heading: "Связаться",
    subheading: "Доступен для удалённой работы и сотрудничества по всему миру.",
    items: [
      {
        label: "Email",
        value: "worknadir95@gmail.com",
        href: "mailto:worknadir95@gmail.com",
      },
      {
        label: "Телефон",
        value: "+82 (10) 8173 7778",
        href: "tel:+821081737778",
      },
      { label: "Адрес", value: "Пусан, Южная Корея — Удалённо ОК" },
      { label: "Время отклика", value: "В течение 24 часов" },
    ],
    social: [
      { label: "GitHub", href: "https://github.com/nodiry" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/nodirbek-bokiev",
      },
      { label: "Telegram", href: "https://t.me/RBNNB" },
    ],
  },
};

export const LANG_OPTIONS: {
  key: string;
  label: string;
  native: string;
  lang: Lang;
}[] = [
  { key: "E", label: "English", native: "English", lang: "en" },
  { key: "K", label: "Korean", native: "한국어", lang: "ko" },
  { key: "R", label: "Russian", native: "Русский", lang: "ru" },
  { key: "U", label: "Uzbek", native: "O'zbekcha", lang: "uz" },
];

export const BOOT_LINES = [
  "GLASSCUBE OS v1.0.0 — INITIALIZING",
  "Loading kernel modules .............. OK",
  "Verifying system integrity .......... OK",
  "Mounting portfolio filesystem ....... OK",
  "Starting visual renderer ............ OK",
  "BOKIEV.NODIRBEK.PORTFOLIO :: LOADED",
];

export const TITLES: Record<Lang, { document: string; tab: string }> = {
  en: { document: "Bokiev Nodirbek", tab: "Portfolio" },
  ko: { document: "보키예프 노디르벡", tab: "포트폴리오" },
  uz: { document: "Boqiyev Nodirbek", tab: "Portfolio" },
  ru: { document: "Бокиев Нодирбек", tab: "Портфолио" },
};
