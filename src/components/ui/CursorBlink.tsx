interface CursorBlinkProps {
  char?: string;
  className?: string;
}

export default function CursorBlink({ char = "█", className = "" }: CursorBlinkProps) {
  return (
    <span
      className={`cursor-blink glow-text-dim ${className}`}
      aria-hidden="true"
      style={{ fontSize: "0.8em", lineHeight: 1 }}
    >
      {char}
    </span>
  );
}
