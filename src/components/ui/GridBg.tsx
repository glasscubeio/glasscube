interface GridBgProps {
  className?: string;
  vignette?: boolean;
}

export default function GridBg({ className = "", vignette = true }: GridBgProps) {
  return (
    <div
      className={`grid-bg absolute inset-0 ${className}`}
      aria-hidden="true"
      style={
        vignette
          ? {
              maskImage:
                "radial-gradient(ellipse 85% 85% at 50% 50%, black 40%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 85% 85% at 50% 50%, black 40%, transparent 100%)",
            }
          : undefined
      }
    />
  );
}
