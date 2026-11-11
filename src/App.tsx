import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import {
  CONTACT,
  CV,
  EDUCATION,
  EXPERIENCE,
  FEATURED,
  KEYWORDS,
  LANGS,
  PROJECTS,
  SKILLS,
  UI,
  type L,
  type Lang,
} from "@/content";
import { CATEGORY_ICONS, LOGOS } from "@/icons";

const loadBackstage = () => import("@/Backstage");
const Backstage = lazy(loadBackstage);

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
    return (
      <img src={icon} alt="" className="size-5 rounded-sm object-contain" />
    );
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
  id,
  action,
  children,
}: {
  index: number;
  title: string;
  id?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-16 md:mt-24">
      <h2 className="flex items-baseline gap-3 border-b border-ink pb-2 font-mono text-xs uppercase tracking-widest">
        <span className="text-accent">{String(index).padStart(2, "0")}</span>
        <span className="text-muted">{title}</span>
        {action && <span className="ml-auto">{action}</span>}
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

type Project = (typeof PROJECTS)[number];
type T = (s: L) => string;

const ALL_HREF = "/work";
const projectHref = (slug: string) => `${ALL_HREF}/${slug}`;
const isRoute = (path: string) => path === "/" || path.startsWith(ALL_HREF);
const currentPath = () => location.pathname.replace(/(.)\/$/, "$1");

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border border-accent px-2 py-0.5 font-mono text-xs">
      {children}
    </span>
  );
}

function ProjectTitle({ p }: { p: Project }) {
  return (
    <a href={projectHref(p.slug)} className="after:absolute after:inset-0">
      {p.name}{" "}
      <span className="inline-block text-accent transition-transform group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}

function ProjectLinks({ p, t }: { p: Project; t: T }) {
  return (
    <p className="relative z-10 mt-3 flex gap-4 self-start font-mono text-sm">
      {p.demo && <Link href={p.demo}>{t(UI.demo)} ↗</Link>}
      <Link href={p.github}>{t(UI.code)} ↗</Link>
    </p>
  );
}

function AllProjects({ t }: { t: T }) {
  return (
    <article className="mt-8 md:mt-12">
      <nav className="font-mono text-sm">
        <a href="/" className="hover:text-accent">
          ← {t(UI.back)}
        </a>
      </nav>
      <h1 className="mt-10 text-4xl font-semibold tracking-tight sm:text-5xl md:mt-14">
        {t(UI.allProjects)}
      </h1>
      <ul className="mt-8 border-t border-ink">
        {PROJECTS.map((p) => (
          <li
            key={p.slug}
            className="group relative grid border-b border-line py-6 sm:grid-cols-[1fr_auto] sm:gap-8"
          >
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="text-lg font-semibold group-hover:text-accent">
                  <ProjectTitle p={p} />
                </h2>
                {p.tag && <Tag>{t(p.tag)}</Tag>}
              </div>
              <p className="mt-1">{t(p.description)}</p>
              <Stack items={p.stack} />
            </div>
            <ProjectLinks p={p} t={t} />
          </li>
        ))}
      </ul>
    </article>
  );
}

function ProjectPage({
  index,
  back,
  t,
}: {
  index: number;
  back: string;
  t: T;
}) {
  const p = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  return (
    <article className="mt-8 md:mt-12">
      <nav className="flex flex-wrap justify-between gap-4 font-mono text-sm">
        <a href={back} className="hover:text-accent">
          ← {t(UI.back)}
        </a>
        <a href={projectHref(next.slug)} className="hover:text-accent">
          {t(UI.next)}: {next.name} →
        </a>
      </nav>

      <header className="mt-10 md:mt-14">
        {p.tag && <Tag>{t(p.tag)}</Tag>}
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {p.name}
        </h1>
        <p className="mt-4 text-xl text-muted">{t(p.description)}</p>
        {p.details?.facts && (
          <dl className="mt-8 border-t border-line">
            {p.details.facts.map((f) => (
              <div
                key={f.label.en}
                className="grid gap-1 border-b border-line py-3 sm:grid-cols-[11rem_1fr] sm:gap-8"
              >
                <dt className="font-mono text-sm text-muted">{t(f.label)}</dt>
                <dd>{t(f.value)}</dd>
              </div>
            ))}
          </dl>
        )}
        <ProjectLinks p={p} t={t} />
        <Stack items={p.stack} />
      </header>

      {p.details?.sections?.map((s, i) => (
        <Section key={s.title.en} index={i + 1} title={t(s.title)}>
          <div className="mt-6 space-y-4">
            {s.body?.map((b) => (
              <p key={b.en}>{t(b)}</p>
            ))}
          </div>
          {s.images?.map((img) => (
            <figure key={img.src} className="mt-8">
              <img
                src={img.src}
                alt={img.caption ? t(img.caption) : ""}
                className="w-full border border-line"
              />
              {img.caption && (
                <figcaption className="mt-2 font-mono text-xs text-muted">
                  {t(img.caption)}
                </figcaption>
              )}
            </figure>
          ))}
        </Section>
      ))}

      <a
        href={projectHref(next.slug)}
        className="group mt-16 block border-y border-ink py-8 md:mt-24"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          {t(UI.next)}
        </span>
        <span className="mt-2 flex items-center justify-between text-2xl font-semibold group-hover:text-accent">
          {next.name}
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </a>
    </article>
  );
}

function App() {
  const [lang, setLang] = useState(initialLang);
  const [dark, setDark] = useState(false);
  const [stage, setStage] = useState<number | null>(null);
  const [route, setRoute] = useState({ path: currentPath(), from: "", fromList: false });
  const open = PROJECTS.findIndex((p) => route.path === projectHref(p.slug));
  const listing = route.path === ALL_HREF;
  const t = (s: L) => s[lang];
  const month = (ym: string) =>
    new Date(`${ym}-01T00:00`).toLocaleDateString(lang, {
      year: "numeric",
      month: "short",
    });

  useEffect(() => {
    if (!matchMedia("(min-width: 40rem)").matches) return;
    const prefetch = () => {
      const run = () => void loadBackstage();
      if ("requestIdleCallback" in window) requestIdleCallback(run);
      else setTimeout(run, 200);
    };
    if (document.readyState === "complete") prefetch();
    else addEventListener("load", prefetch, { once: true });
    return () => removeEventListener("load", prefetch);
  }, []);

  useEffect(() => {
    const onPop = () =>
      setRoute((r) => {
        const path = currentPath();
        const project = path.startsWith(`${ALL_HREF}/`);
        return { path, from: r.path, fromList: project && (r.path === ALL_HREF || r.fromList) };
      });
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a");
      if (!a || a.target || a.hasAttribute("download")) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || !isRoute(url.pathname)) return;
      e.preventDefault();
      history.pushState(null, "", url.pathname);
      onPop();
    };
    addEventListener("popstate", onPop);
    document.addEventListener("click", onClick);
    return () => {
      removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (route.path === "/" && route.from.startsWith(ALL_HREF))
      document.getElementById("work")?.scrollIntoView();
    else (document.querySelector("[data-stage]") ?? window).scrollTo(0, 0);
  }, [route]);

  useEffect(() => {
    const page =
      open >= 0 ? PROJECTS[open].name : listing ? UI.allProjects[lang] : "";
    document.documentElement.lang = lang;
    document.title = page
      ? `${page} · ${UI.name[lang]}`
      : `${UI.name[lang]} · ${UI.title[lang]}`;
  }, [lang, open, listing]);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const exitStage = (top: number) => {
    setStage(null);
    requestAnimationFrame(() => scrollTo(0, top));
  };

  const openProject = (href: string) => {
    setStage(null);
    history.pushState(null, "", href);
    dispatchEvent(new PopStateEvent("popstate"));
  };

  const page = (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-3 font-mono text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="size-2 animate-pulse rounded-full bg-accent" />
          <span>
            BUSAN · <Clock />
            <span className="hidden sm:inline"> · {t(UI.status)}</span>
          </span>
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
            onClick={() => (stage === null ? setStage(scrollY) : exitStage(0))}
            className="hidden border-l border-line pl-3 hover:text-ink sm:inline"
          >
            {t(stage === null ? UI.backstage : UI.exit)}
          </button>
          <button
            onClick={() => setDark(!dark)}
            className="border-l border-line pl-3 hover:text-ink"
          >
            {t(dark ? UI.light : UI.dark)}
          </button>
        </span>
      </div>

      {open >= 0 ? (
        <ProjectPage
          index={open}
          back={route.fromList ? ALL_HREF : "/"}
          t={t}
        />
      ) : listing ? (
        <AllProjects t={t} />
      ) : (
        <>
          <header className="mt-8 md:mt-12">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-7xl">
              {t(UI.name)}
            </h1>
            <p className="mt-3 text-xl font-medium sm:text-2xl">
              {t(UI.title)}
            </p>
            <p className="mt-4 flex flex-wrap gap-x-2 font-mono text-sm sm:gap-x-3">
              {KEYWORDS.map((k, i) => (
                <span key={k} className="flex gap-2 sm:gap-3">
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
                  className="grid gap-1 border-b border-line py-6 md:py-8 sm:grid-cols-[11rem_1fr] sm:gap-8"
                >
                  <p className="font-mono text-sm text-muted">
                    {month(job.start)} –<br className="hidden sm:block" />{" "}
                    {job.end ? month(job.end) : t(UI.present)}
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {t(job.role)} ·{" "}
                      {job.url ? (
                        <Link href={job.url}>{job.company}</Link>
                      ) : (
                        job.company
                      )}
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

          <Section
            index={2}
            title={t(UI.work)}
            id="work"
            action={
              <a href={ALL_HREF} className="text-accent hover:underline">
                {t(UI.viewAll)} →
              </a>
            }
          >
            <ul className="grid gap-px border-b border-line bg-line sm:grid-cols-2">
              {FEATURED.map((p) => (
                <li
                  key={p.name}
                  className="group relative flex flex-col bg-bg py-6 md:py-8 sm:odd:pr-8 sm:even:pl-8"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-lg font-semibold group-hover:text-accent">
                      <ProjectTitle p={p} />
                    </h3>
                    {p.tag && <Tag>{t(p.tag)}</Tag>}
                  </div>
                  <p className="mt-2 flex-1">{t(p.description)}</p>
                  <Stack items={p.stack} />
                  <ProjectLinks p={p} t={t} />
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
            <div className="grid gap-1 py-6 md:py-8 sm:grid-cols-[11rem_1fr] sm:gap-8">
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
        </>
      )}

      <footer className="mt-16 md:mt-24 flex flex-wrap items-baseline justify-between gap-4 border-t border-ink pt-6 text-sm">
        <Contacts />
        <span className="font-mono text-xs text-muted">
          © 2026 {t(UI.name)}
        </span>
      </footer>
    </main>
  );

  if (stage === null) return page;
  return (
    <Suspense fallback={page}>
      <Backstage
        scrollY={stage}
        lang={lang}
        onExit={exitStage}
        onOpen={openProject}
      >
        {page}
      </Backstage>
    </Suspense>
  );
}

export default App;
