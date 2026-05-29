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

export const PROJECTS: Project[] = [
  {
    id: "tarmoqda",
    name: "Tarmoqda",
    description:
      "Social network platform for Uzbek-speaking users. Real-time messaging, posts, follows — built for scale with WebSocket + gRPC microservices.",
    stack: ["TypeScript", "Bun.js", "Fastify", "gRPC", "WebSocket", "PostgreSQL", "Memcached", "React"],
    status: "wip",
    github: "https://github.com/nodiry/tarmoqda",
    year: 2025,
  },
  {
    id: "hellostranger",
    name: "HelloStranger",
    description:
      "Anonymous real-time chat — connect with strangers instantly. WebRTC-based video + text, no accounts required. Privacy-first design.",
    stack: ["TypeScript", "WebRTC", "WebSocket", "React", "Vite", "Node.js"],
    status: "live",
    github: "https://github.com/nodiry/hellostranger",
    year: 2025,
  },
  {
    id: "financemate",
    name: "FinanceMate",
    description:
      "Personal finance tracking dashboard with transaction categorization, spending analytics, and budget goal tracking.",
    stack: ["TypeScript", "React", "Vite", "PostgreSQL", "Node.js", "Tailwind"],
    status: "archived",
    github: "https://github.com/nodiry/financemate",
    year: 2024,
  },
  {
    id: "smart-scheduler",
    name: "Smart Scheduler",
    description:
      "AI-assisted task scheduling system with priority queues, calendar sync, and conflict resolution for teams.",
    stack: ["TypeScript", "Go", "PostgreSQL", "React", "Redis"],
    status: "archived",
    github: "#",
    year: 2024,
  },
  {
    id: "botanik",
    name: "Botanik",
    description:
      "Plant identification and care tracking app. Upload a photo, identify species, get care instructions and reminders.",
    stack: ["React Native", "TypeScript", "Bun.js", "MongoDB"],
    status: "wip",
    github: "#",
    year: 2025,
  },
  {
    id: "glasscube-portfolio",
    name: "GlassCube Portfolio",
    description:
      "This portfolio. Terminal-aesthetic developer portfolio with multi-language support, boot sequence, and Tron-inspired design.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    status: "live",
    github: "https://github.com/nodiry/portfolio",
    year: 2025,
  },
];
