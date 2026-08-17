import ScanLines from "../ui/ScanLines";

export default function ThanksScreen() {
  return (
    <div
      className="relative w-screen h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "var(--c-bg)",
        color: "var(--c-text)",
      }}
    >
      <ScanLines />

      <div className="relative z-10 text-center font-mono px-6">
        <p className="text-sm opacity-50 mb-6">&gt; PAYMENT_STATUS: SUCCESS</p>

        <h1 className="text-3xl mb-4">THANK YOU, DONATOR.</h1>

        <p className="opacity-70">Your support keeps this project alive.</p>

        <p className="mt-2 opacity-50 text-sm">
          You can close this window and return to the terminal.
        </p>
      </div>
    </div>
  );
}
