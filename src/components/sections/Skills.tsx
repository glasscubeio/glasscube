import { SKILLS_DATA, type SkillCategory } from "@/constants/skills";
import type { Lang } from "@/constants/translations";
import GridBg from "@/components/ui/GridBg";

interface SkillsProps {
  lang: Lang;
}

function CategoryBlock({ category, index }: { category: SkillCategory; index: number }) {
  return (
    <div
      className="glass-panel p-4 flex flex-col gap-3"
      style={{
        animation: `fadeUp 0.35s ease ${index * 0.06}s both`,
      }}
    >
      <div
        className="text-xs tracking-[0.14em] uppercase font-medium"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--c-green-dim)",
          textShadow: "0 0 5px rgba(0,255,65,0.25)",
          borderBottom: "1px solid var(--c-border-dim)",
          paddingBottom: "0.5rem",
        }}
      >
        <span style={{ color: "var(--c-text-muted)", marginRight: 6 }}>›</span>
        {category.title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {category.items.map((item) => (
          <span key={item} className="skill-badge">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection({ lang }: SkillsProps) {
  const categories = SKILLS_DATA[lang];

  return (
    <div className="relative w-full h-full overflow-y-auto" style={{ background: "var(--c-bg)" }}>
      <GridBg vignette />

      <div className="relative z-10 max-w-4xl mx-auto p-6 lg:p-8 pb-20 lg:pb-8 flex flex-col gap-5">

        {/* Section header */}
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
            cat skills.json | jq
          </span>
        </div>

        {/* Grid of categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {categories.map((cat, i) => (
            <CategoryBlock key={cat.title} category={cat} index={i} />
          ))}
        </div>

        {/* Footer */}
        <div
          className="text-xs tracking-widest text-center"
          style={{
            color: "var(--c-text-muted)",
            fontFamily: "var(--font-mono)",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
          }}
        >
          <span style={{ color: "var(--c-border)", marginRight: 6 }}>›</span>
          Hover badges for details — stack evolves constantly
        </div>
      </div>
    </div>
  );
}
