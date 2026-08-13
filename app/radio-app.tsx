"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  artist: string;
  duration: number;
};

const tracks: Track[] = [
  { id: "01", title: "Vande Mataram", artist: "Rights-cleared upload", duration: 327 },
  { id: "02", title: "Maa Tujhe Salaam", artist: "Rights-cleared upload", duration: 295 },
  { id: "03", title: "Sandese Aate Hain", artist: "Rights-cleared upload", duration: 310 },
  { id: "04", title: "Ae Mere Watan Ke Logon", artist: "Rights-cleared upload", duration: 275 },
];

function formatTime(total: number) {
  const s = Math.max(0, Math.floor(total));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "prev") return <svg {...p}><path d="m5 12 5-4v8l-5-4Z"/><path d="M19 7v10"/><path d="M10 8v8"/></svg>;
  if (name === "next") return <svg {...p}><path d="m19 12-5-4v8l5-4Z"/><path d="M5 7v10"/><path d="M14 8v8"/></svg>;
  if (name === "pause") return <svg {...p}><path d="M8 5v14M16 5v14"/></svg>;
  if (name === "play") return <svg {...p}><path d="m9 5 10 7-10 7V5Z" fill="currentColor" stroke="none"/></svg>;
  if (name === "menu") return <svg {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
  if (name === "info") return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7.5h.01"/></svg>;
  return null;
}

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time || "--:--:--"}</span>;
}

export default function RadioApp() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(84);
  const track = tracks[index];
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setCurrent((value) => {
        if (value + 1 >= track.duration) {
          setIndex((i) => (i + 1) % tracks.length);
          return 0;
        }
        return value + 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing, track.duration]);

  const change = (delta: number) => {
    setIndex((i) => (i + delta + tracks.length) % tracks.length);
    setCurrent(0);
  };

  const seek = (clientX: number) => {
    const el = progressRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    setCurrent(ratio * track.duration);
  };

  const percent = useMemo(() => Math.min(100, (current / track.duration) * 100), [current, track.duration]);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#101311] text-white">
      {/* The supplied artwork already contains the complete visual composition.
          Keep it unobstructed instead of stacking a second player/title over it. */}
      <div className="hero-bg fixed inset-0" aria-hidden="true" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" aria-hidden="true" />

      {/* Small live controls: they sit over the artwork without creating a second visible layout. */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between p-4 sm:p-5">
        <button aria-label="Menu" className="pointer-events-auto grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-black/25 text-white/90 backdrop-blur-md transition hover:bg-black/40">
          <Icon name="menu" />
        </button>
        <div className="hidden rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-center text-xs text-white/80 backdrop-blur-md md:block">
          <div className="text-[10px] uppercase tracking-[.28em] text-white/60">Live India Time</div>
          <div className="mt-0.5 tabular-nums"><Clock /></div>
        </div>
      </header>

      {/* Transparent interaction layer aligned to the player drawn into scene-wide.png. */}
      <section className="pointer-events-none absolute inset-0 z-10" aria-label="Radio controls">
        <div className="absolute left-1/2 top-[42.5%] w-[41.5vw] min-w-[330px] max-w-[650px] -translate-x-1/2 sm:top-[43%]">
          <button
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => setPlaying((v) => !v)}
            className="pointer-events-auto absolute left-1/2 top-[69%] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white/0 transition hover:bg-white/10 focus-visible:bg-white/10 focus-visible:text-white"
          >
            <Icon name={playing ? "pause" : "play"} size={25} />
          </button>

          <button
            aria-label="Previous track"
            onClick={() => change(-1)}
            className="pointer-events-auto absolute left-[32%] top-[69%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full text-white/0 hover:bg-white/10 focus-visible:bg-white/10 focus-visible:text-white"
          >
            <Icon name="prev" />
          </button>

          <button
            aria-label="Next track"
            onClick={() => change(1)}
            className="pointer-events-auto absolute left-[68%] top-[69%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full text-white/0 hover:bg-white/10 focus-visible:bg-white/10 focus-visible:text-white"
          >
            <Icon name="next" />
          </button>

          <div
            ref={progressRef}
            onPointerDown={(e) => seek(e.clientX)}
            className="pointer-events-auto absolute left-[11%] right-[11%] top-[58%] h-8 -translate-y-1/2 cursor-pointer touch-none"
            aria-label="Seek"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={track.duration}
            aria-valuenow={current}
            tabIndex={0}
          >
            <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-transparent" />
            <div className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-transparent" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </section>

      {/* Screen-reader/live metadata, visually hidden so it cannot disturb the artwork alignment. */}
      <div className="sr-only" aria-live="polite">
        {playing ? `Playing ${track.title}` : `Paused ${track.title}`}. {formatTime(current)} of {formatTime(track.duration)}.
      </div>

      {/* Compact mobile transport, because the 16:9 desktop artwork is intentionally cropped on phones. */}
      <div className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/45 p-2 backdrop-blur-xl sm:hidden">
        <button aria-label="Previous" onClick={() => change(-1)} className="grid h-10 w-10 place-items-center rounded-full text-white/80"><Icon name="prev" size={18} /></button>
        <button aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((v) => !v)} className="grid h-12 w-12 place-items-center rounded-full bg-[#e97820] shadow-lg"><Icon name={playing ? "pause" : "play"} size={21} /></button>
        <button aria-label="Next" onClick={() => change(1)} className="grid h-10 w-10 place-items-center rounded-full text-white/80"><Icon name="next" size={18} /></button>
      </div>

      <div className="sr-only">Current track: {track.title} — {track.artist}.</div>
    </main>
  );
}
