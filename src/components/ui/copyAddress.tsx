import { useState } from "react";

export function CopyAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);

    // Reset the button text after a short delay.
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="btn-glow"
      style={{
        padding: "0.35rem 0.55rem",
        fontSize: "0.65rem",
        fontFamily: "var(--font-mono)",
        whiteSpace: "nowrap",
      }}
      aria-label="Copy crypto address"
    >
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}
