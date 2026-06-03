import { PROJECTS, PROJECT_CONTENT, type Project } from "@/constants/projects";
import { STATUS_LABELS, type Lang } from "@/constants/translations";
import GridBg from "@/components/ui/GridBg";

const STATUS_COLOR: Record<Project["status"], { color: string; glow: string }> =
  {
    live: { color: "var(--c-green)", glow: "var(--glow-sm)" },
    wip: { color: "var(--c-ice)", glow: "0 0 6px rgba(212,240,255,0.4)" },
    archived: { color: "var(--c-text-muted)", glow: "none" },
  };

function ProjectCard({
  project,
  index,
  lang,
}: {
  project: Project;
  index: number;
  lang: Lang;
}) {
  const style = STATUS_COLOR[project.status];
  const statusLabel = STATUS_LABELS[lang][project.status];
  const i18n = PROJECT_CONTENT[lang][project.id];
  const name = i18n?.name ?? project.name;
  const description = i18n?.description ?? project.description;

  return (
    <div
      className="project-card p-5 flex flex-col gap-3"
      style={{ animation: `fadeUp 0.35s ease ${index * 0.06}s both` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h3
            className="font-medium leading-tight"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.82rem",
              color: "var(--c-text-bright)",
              letterSpacing: "0.04em",
            }}
          >
            {name}
          </h3>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              color: "var(--c-text-muted)",
              letterSpacing: "0.1em",
            }}
          >
            {project.year}
          </span>
        </div>
        <span
          className="text-xs shrink-0"
          style={{
            fontFamily: "var(--font-mono)",
            color: style.color,
            textShadow: style.glow,
            letterSpacing: "0.1em",
            border: "1px solid currentColor",
            opacity: 0.7,
            padding: "0.1rem 0.4rem",
            fontSize: "0.6rem",
          }}
        >
          {statusLabel}
        </span>
      </div>

      {project.img && (
        <img
          src={project.img}
          alt={name}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Description */}
      <p
        className="leading-relaxed flex-1"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          color: "var(--c-text-dim)",
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>

      {/* Stack tags */}
      <div
        className="flex flex-wrap gap-1 pt-1"
        style={{ borderTop: "1px solid var(--c-border-dim)" }}
      >
        {project.stack.slice(0, 6).map((tech) => (
          <span
            key={tech}
            className="skill-badge"
            style={{ fontSize: "0.6rem" }}
          >
            {tech}
          </span>
        ))}
        {project.stack.length > 6 && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              color: "var(--c-text-muted)",
              padding: "0.18rem 0.3rem",
            }}
          >
            +{project.stack.length - 6}
          </span>
        )}
      </div>

      {/* Links */}
      {project.github && project.github !== "#" && (
        <div className="flex gap-2 pt-1">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="btn-glow text-center"
            style={{
              flex: 1,
              textDecoration: "none",
              display: "block",
              fontSize: "0.65rem",
            }}
          >
            GitHub ↗
          </a>
          {project.demo && project.demo !== "#" && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="btn-glow primary text-center"
              style={{
                flex: 1,
                textDecoration: "none",
                display: "block",
                fontSize: "0.65rem",
              }}
            >
              Demo ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProjectsSection({ lang }: { lang: Lang }) {
  return (
    <div
      className="relative w-full h-full overflow-y-auto"
      style={{ background: "var(--c-bg)" }}
    >
      <GridBg vignette />

      <div className="relative z-10 max-w-5xl mx-auto p-6 lg:p-8 pb-20 lg:pb-8 flex flex-col gap-5">
        {/* Header */}
        <div
          className="flex items-center gap-3 stagger-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: "var(--c-text-muted)" }}
          >
            boot@glasscube:~$
          </span>
          <span className="glow-text-dim text-xs tracking-widest">
            ls -la ./projects
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              lang={lang}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
