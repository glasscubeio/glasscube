import { useEffect, useState, type ReactNode } from "react";
import {
  CONTACT,
  EDUCATION,
  EXPERIENCE,
  LANGS,
  PROJECTS,
  SKILLS,
  UI,
  type L,
  type Lang,
} from "@/content";

const initialLang = (): Lang =>
  navigator.language.startsWith("ko") ? "ko" : "en";

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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="border-b border-ink pb-2 font-mono text-xs uppercase tracking-widest text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({
  title,
  aside,
  children,
}: {
  title: ReactNode;
  aside: ReactNode;
  children?: ReactNode;
}) {
  return (
    <li className="border-b border-line py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="font-semibold">{title}</h3>
        <span className="font-mono text-sm text-muted">{aside}</span>
      </div>
      {children}
    </li>
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
    <main className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      <header>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t(UI.name)}
          </h1>
          <div className="flex gap-3 pt-2 font-mono text-sm">
            {(Object.keys(LANGS) as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={l === lang}
                className={l === lang ? "text-ink" : "text-muted hover:text-ink"}
              >
                {LANGS[l]}
              </button>
            ))}
            <button
              onClick={() => setDark(!dark)}
              className="border-l border-line pl-3 text-muted hover:text-ink"
            >
              {t(dark ? UI.light : UI.dark)}
            </button>
          </div>
        </div>
        <p className="mt-2 text-lg font-medium">{t(UI.title)}</p>
        <p className="mt-4 text-muted">{t(UI.summary)}</p>
        <p className="mt-4 font-mono text-sm text-muted">{t(UI.location)}</p>
        <div className="mt-6">
          <Contacts />
        </div>
      </header>

      <Section title={t(UI.experience)}>
        <ol>
          {EXPERIENCE.map((job) => (
            <Row
              key={job.company}
              title={`${t(job.role)} · ${job.company}`}
              aside={`${month(job.start)} – ${job.end ? month(job.end) : t(UI.present)}`}
            >
              <p className="text-sm text-muted">
                {t(job.type)} · {t(job.place)}
              </p>
              <p className="mt-2">{t(job.summary)}</p>
            </Row>
          ))}
        </ol>
      </Section>

      <Section title={t(UI.work)}>
        <ul>
          {PROJECTS.map((p) => (
            <Row
              key={p.github}
              title={t(p.name)}
              aside={
                <span className="flex gap-4">
                  <Link href={p.demo}>{t(UI.demo)}</Link>
                  <Link href={p.github}>{t(UI.code)}</Link>
                </span>
              }
            >
              <p className="mt-1">{t(p.description)}</p>
              <p className="mt-2 font-mono text-xs text-muted">
                {p.stack.join(" · ")}
              </p>
            </Row>
          ))}
        </ul>
      </Section>

      <Section title={t(UI.skills)}>
        <dl>
          {SKILLS.map((s) => (
            <div
              key={s.title.en}
              className="grid gap-1 border-b border-line py-3 sm:grid-cols-[11rem_1fr] sm:gap-4"
            >
              <dt className="text-sm text-muted">{t(s.title)}</dt>
              <dd>{s.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title={t(UI.education)}>
        <ul>
          <Row
            title={`${t(EDUCATION.school)} · ${t(EDUCATION.degree)}`}
            aside={t(EDUCATION.place)}
          />
        </ul>
      </Section>

      <footer className="mt-14 text-sm">
        <Contacts />
      </footer>
    </main>
  );
}

export default App;
