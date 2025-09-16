// src/components/IframeEmbed.jsx
import { useRef } from "react";

export default function IframeEmbed({ src, title }) {
  const ref = useRef(null);
  const goFullscreen = () => {
    const el = ref.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
  };
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 16:9 wrapper */}
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <iframe
          ref={ref}
          src={src}
          title={title}
          allow="fullscreen; gamepad; xr-spatial-tracking"
          className="absolute inset-0 w-full h-full rounded-xl border border-white/10 shadow-lg bg-black"
        />
      </div>

      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={goFullscreen}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm"
        >
          Plein écran / Fullscreen
        </button>
        <span className="text-sm text-white/60">
          Clique dans la fenêtre pour capturer le clavier (ZQSD / WASD).
        </span>
      </div>
    </div>
  );
}
