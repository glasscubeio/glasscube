import { useEffect, useState, type ReactNode } from "react";
import {
  CONTACT,
  CV,
  EDUCATION,
  EXPERIENCE,
  KEYWORDS,
  LANGS,
  PROJECTS,
  SKILLS,
  UI,
  type L,
  type Lang,
} from "@/content";
import { CATEGORY_ICONS, LOGOS } from "@/icons";

const initialLang = (): Lang =>
  navigator.language.startsWith("ko") ? "ko" : "en";

const kst = () =>
  new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Seoul" });

function Clock() {
  const [time, setTime] = useState(kst);
  useEffect(() => {
    const id = setInterval(() => setTime(kst()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time} KST</span>;
}

const brandColor = (hex: string) => {
  const n = parseInt(hex, 16);
  const luma = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return luma < 40 || luma > 220 ? undefined : `#${hex}`;
};

function Logo({ name }: { name: string }) {
  const icon = LOGOS[name.split(" (")[0]];
  if (!icon) return null;
  if (typeof icon === "string")
    return <img src={icon} alt="" className="size-5 rounded-sm object-contain" />;
  if (!("path" in icon)) {
    const Glyph = icon;
    return <Glyph className="size-5 text-muted" strokeWidth={1.75} />;
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 fill-current"
      style={{ color: brandColor(icon.hex) }}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}

function Link({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent"
    >
      {children}
    </a>
  );
}

function Contacts() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {CONTACT.map((c) => (
        <li key={c.href}>
          <Link href={c.href}>{c.label}</Link>
        </li>
      ))}
    </ul>
  );
}

function Section({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-24">
      <h2 className="flex items-baseline gap-3 border-b border-ink pb-2 font-mono text-xs uppercase tracking-widest">
        <span className="text-accent">{String(index).padStart(2, "0")}</span>
        <span className="text-muted">{title}</span>
      </h2>
      {children}
    </section>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <p className="mt-3 font-mono text-xs text-muted">{items.join(" · ")}</p>
  );
}

function App() {
  const [lang, setLang] = useState(initialLang);
  const [dark, setDark] = useState(false);
  const t = (s: L) => s[lang];
  const month = (ym: string) =>
    new Date(`${ym}-01T00:00`).toLocaleDateString(lang, {
      year: "numeric",
      month: "short",
    });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${UI.name[lang]} · ${UI.title[lang]}`;
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-3 font-mono text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="size-2 animate-pulse rounded-full bg-accent" />
          RKPK · BUSAN · <Clock /> · {t(UI.status)}
        </span>
        <span className="flex gap-3">
          {(Object.keys(LANGS) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={l === lang}
              className={l === lang ? "text-ink" : "hover:text-ink"}
            >
              {LANGS[l]}
            </button>
          ))}
          <button
            onClick={() => setDark(!dark)}
            className="border-l border-line pl-3 hover:text-ink"
          >
            {t(dark ? UI.light : UI.dark)}
          </button>
        </span>
      </div>

      <header className="mt-12">
        <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
          {t(UI.name)}
        </h1>
        <p className="mt-3 text-xl font-medium sm:text-2xl">{t(UI.title)}</p>
        <p className="mt-4 flex flex-wrap gap-x-3 font-mono text-sm">
          {KEYWORDS.map((k, i) => (
            <span key={k} className="flex gap-3">
              {i > 0 && <span className="text-accent">·</span>}
              {k}
            </span>
          ))}
        </p>
        <div className="mt-8 text-sm">
          <Contacts />
        </div>
        <div className="mt-5 flex flex-wrap gap-3 font-mono text-xs">
          {(["en", "ko"] as const).map((l) => (
            <a
              key={l}
              href={CV[l]}
              download
              className="border border-ink px-3 py-2 hover:border-accent hover:bg-accent hover:text-bg"
            >
              ↓ {t(l === "en" ? UI.cvEn : UI.cvKo)}
            </a>
          ))}
        </div>
      </header>

      <Section index={1} title={t(UI.experience)}>
        <ol>
          {EXPERIENCE.map((job) => (
            <li
              key={job.company}
              className="grid gap-1 border-b border-line py-8 sm:grid-cols-[11rem_1fr] sm:gap-8"
            >
              <p className="font-mono text-sm text-muted">
                {month(job.start)} –<br className="hidden sm:block" />{" "}
                {job.end ? month(job.end) : t(UI.present)}
              </p>
              <div>
                <h3 className="text-lg font-semibold">
                  {t(job.role)} ·{" "}
                  {job.url ? <Link href={job.url}>{job.company}</Link> : job.company}
                </h3>
                <p className="text-sm text-muted">
                  {t(job.type)} · {t(job.place)}
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 marker:text-accent">
                  {job.bullets.map((b) => (
                    <li key={b.en}>{t(b)}</li>
                  ))}
                </ul>
                <Stack items={job.stack} />
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section index={2} title={t(UI.work)}>
        <ul className="grid gap-px border-b border-line bg-line sm:grid-cols-2">
          {PROJECTS.map((p) => (
            <li key={p.name} className="flex flex-col bg-bg py-8 sm:odd:pr-8 sm:even:pl-8">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <span className="border border-accent px-2 py-0.5 font-mono text-xs">
                  {t(p.tag)}
                </span>
              </div>
              <p className="mt-2 flex-1">{t(p.description)}</p>
              <Stack items={p.stack} />
              <p className="mt-3 flex gap-4 font-mono text-sm">
                <Link href={p.demo}>{t(UI.demo)} ↗</Link>
                <Link href={p.github}>{t(UI.code)} ↗</Link>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section index={3} title={t(UI.skills)}>
        <dl>
          {SKILLS.map((s) => {
            const Icon = CATEGORY_ICONS[s.title.en];
            return (
              <div
                key={s.title.en}
                className="grid gap-3 border-b border-line py-5 sm:grid-cols-[13rem_1fr] sm:gap-8"
              >
                <dt className="flex items-center gap-2 font-mono text-sm text-muted">
                  <Icon className="size-5 text-accent" strokeWidth={1.75} />
                  {t(s.title)}
                </dt>
                <dd className="flex flex-wrap gap-x-7 gap-y-3">
                  {s.items.map((item) => (
                    <span key={item} className="flex items-center gap-2">
                      <Logo name={item} />
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            );
          })}
        </dl>
      </Section>

      <Section index={4} title={t(UI.education)}>
        <div className="grid gap-1 py-8 sm:grid-cols-[11rem_1fr] sm:gap-8">
          <p className="font-mono text-sm text-muted">
            {EDUCATION.start} – {EDUCATION.end}
          </p>
          <div>
            <h3 className="text-lg font-semibold">
              {t(EDUCATION.school)} · {t(EDUCATION.degree)}
            </h3>
            <p className="text-sm text-muted">{t(EDUCATION.place)}</p>
          </div>
        </div>
      </Section>

      <footer className="mt-24 flex flex-wrap items-baseline justify-between gap-4 border-t border-ink pt-6 text-sm">
        <Contacts />
        <span className="font-mono text-xs text-muted">© 2026 {t(UI.name)}</span>
      </footer>
    </main>
  );
}

export default App;
