import type { ReactNode, CSSProperties } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  bright?: boolean;
  style?: CSSProperties;
}

export default function GlassPanel({ children, className = "", bright = false, style }: GlassPanelProps) {
  return (
    <div
      className={`${bright ? "glass-panel-bright" : "glass-panel"} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
