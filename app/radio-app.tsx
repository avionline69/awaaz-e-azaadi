\
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  artist: string;
  film: string;
  year: number;
  duration: number;
  videoId?: string;
};

const tracks: Track[] = [
  { id: "01", title: "Vande Mataram", artist: "Rights-cleared upload", film: "Awaaz-e-Azaadi", year: 2026, duration: 327 },
  { id: "02", title: "Maa Tujhe Salaam", artist: "Rights-cleared upload", film: "Awaaz-e-Azaadi", year: 2026, duration: 295 },
  { id: "03", title: "Sandese Aate Hain", artist: "Rights-cleared upload", film: "Awaaz-e-Azaadi", year: 2026, duration: 310 },
  { id: "04", title: "Ae Mere Watan Ke Logon", artist: "Rights-cleared upload", film: "Awaaz-e-Azaadi", year: 2026, duration: 275 }
];

function formatTime(total: number) {
  const s = Math.max(0, Math.floor(total));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "prev") return <svg {...p}><path d="m5 12 5-4v8l-5-4Z"/><path d="M19 7v10"/><path d="M10 8v8"/></svg>;
  if (name === "next") return <svg {...p}><path d="m19 12-5-4v8l5-4Z"/><path d="M5 7v10"/><path d="M14 8v8"/></svg>;
  if (name === "pause") return <svg {...p}><path d="M8 5v14M16 5v14"/></svg>;
  if (name === "play") return <svg {...p}><path d="m9 5 10 7-10 7V5Z" fill="currentColor" stroke="none"/></svg>;
  if (name === "heart") return <svg {...p}><path d="M20.8 8.7c0 5.2-8.8 10-8.8 10S3.2 13.9 3.2 8.7A4.4 4.4 0 0 1 12 6.4a4.4 4.4 0 0 1 8.8 2.3Z"/></svg>;
  if (name === "shuffle") return <svg {...p}><path d="M4 7h3c4 0 5 10 10 10h3"/><path d="m17 14 3 3-3 3"/><path d="M4 17h3c1.5 0 2.5-.8 3.2-1.8"/><path d="M17 4l3 3-3 3"/><path d="M10.2 8.8C11 7.8 12 7 13.5 7H20"/></svg>;
  if (name === "volume") return <svg {...p}><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M17 9a5 5 0 0 1 0 6"/><path d="M19.5 6.5a9 9 0 0 1 0 11"/></svg>;
  if (name === "menu") return <svg {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
  if (name === "radio") return <svg {...p}><rect x="4" y="7" width="16" height="12" rx="2"/><path d="m7 7 4-4M7 11h4M7 15h2M16 13a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/></svg>;
  if (name === "info") return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7.5h.01"/></svg>;
  return null;
}

function Vinyl({ playing, small = false }: { playing: boolean; small?: boolean }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full border border-white/20 bg-[#171a17] shadow-2xl ${small ? "h-16 w-16" : "h-20 w-20"} ${playing ? "vinyl-spin" : ""}`}>
      <div className="absolute inset-[7%] rounded-full bg-[repeating-radial-gradient(circle_at_center,#171717_0,#242424_2px,#101010_4px,#292929_5px)]" />
      <div className="absolute inset-[19%] rounded-full border border-white/10 bg-cover bg-center" style={{ backgroundImage: 'url("/bg/scene-wide.png")' }} />
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/80 ring-2 ring-white/40" />
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true
    }).format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="glass rounded-2xl px-4 py-3 text-center shadow-xl">
      <div className="text-[10px] font-medium tracking-[.22em] text-white/65">INDIA TIME</div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{time || "--:--:--"}</div>
      <div className="mt-1 text-[10px] text-white/55"><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#f47b20]" />IST</div>
    </div>
  );
}

function Progress({ current, duration, onSeek }: { current: number; duration: number; onSeek: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const seek = (clientX: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (clientX - r.left) / r.width)));
  };
  return (
    <div className="group relative h-6 touch-none" ref={ref} onPointerDown={(e) => seek(e.clientX)}>
      <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/15" />
      <div className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-[#f47b20] to-[#3f8f4d] shadow-[0_0_10px_rgba(244,123,32,.6)]" style={{ width: `${duration ? Math.min(100, current / duration * 100) : 0}%` }} />
      <div className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100" style={{ left: `calc(${duration ? Math.min(100, current / duration * 100) : 0}% - 6px)` }} />
    </div>
  );
}

function DesktopPlayer({ track, playing, current, setCurrent, toggle, next, prev, liked, setLiked }: any) {
  return (
    <div className="glass hidden w-full max-w-3xl items-center gap-4 rounded-full p-3 pr-5 sm:flex">
      <Vinyl playing={playing} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-semibold">{track.title}</div>
            <div className="truncate text-[12.5px] text-white/70">{track.artist}</div>
          </div>
          <button onClick={() => setLiked(!liked)} className="text-white/80 hover:text-white"><Icon name="heart" /></button>
        </div>
        <Progress current={current} duration={track.duration} onSeek={(v) => setCurrent(v * track.duration)} />
        <div className="flex justify-between text-[10.5px] tabular-nums text-white/55"><span>{formatTime(current)}</span><span>{formatTime(track.duration)}</span></div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={prev} className="rounded-full p-3 text-white/80 hover:bg-white/10"><Icon name="prev" /></button>
        <button onClick={toggle} className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-b from-[#ffad56] to-[#e56a17] text-white ring-1 ring-white/25 shadow-[0_8px_24px_rgba(244,123,32,.35)]">
          <Icon name={playing ? "pause" : "play"} />
        </button>
        <button onClick={next} className="rounded-full p-3 text-white/80 hover:bg-white/10"><Icon name="next" /></button>
      </div>
    </div>
  );
}

function MobilePlayer({ track, playing, current, setCurrent, toggle, next, prev }: any) {
  return (
    <div className="glass w-full max-w-xl rounded-[26px] p-4 sm:hidden">
      <div className="flex items-center gap-3">
        <Vinyl playing={playing} small />
        <div className="min-w-0">
          <div className="truncate text-[15px] font-semibold">{track.title}</div>
          <div className="truncate text-[12.5px] text-white/65">{track.artist}</div>
          <div className="mt-1 flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-white/55"><span className="h-1.5 w-1.5 rounded-full bg-[#3f8f4d]" /> on air</div>
        </div>
      </div>
      <div className="mt-3"><Progress current={current} duration={track.duration} onSeek={(v) => setCurrent(v * track.duration)} /></div>
      <div className="flex items-center justify-between">
        <div className="text-[10.5px] tabular-nums text-white/55">{formatTime(current)} / {formatTime(track.duration)}</div>
        <div className="flex items-center gap-1">
          <button onClick={prev} className="min-h-11 min-w-11 rounded-full p-2"><Icon name="prev" /></button>
          <button onClick={toggle} className="grid h-[52px] w-[52px] place-items-center rounded-full bg-gradient-to-b from-[#ffad56] to-[#e56a17] ring-1 ring-white/25 shadow-[0_8px_24px_rgba(244,123,32,.35)]"><Icon name={playing ? "pause" : "play"} size={22} /></button>
          <button onClick={next} className="min-h-11 min-w-11 rounded-full p-2"><Icon name="next" /></button>
        </div>
      </div>
    </div>
  );
}

export default function RadioApp() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState(false);
  const track = tracks[index];

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setCurrent(v => {
      if (v + 1 >= track.duration) {
        setIndex(i => (i + 1) % tracks.length);
        return 0;
      }
      return v + 1;
    }), 1000);
    return () => clearInterval(id);
  }, [playing, track.duration]);

  const change = (delta: number) => {
    setIndex(i => (i + delta + tracks.length) % tracks.length);
    setCurrent(0);
  };

  const toggle = () => setPlaying(v => !v);

  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      <div className="hero-bg fixed inset-0 -z-20" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/5 to-black/85" />
      <div className="fixed inset-0 -z-10 opacity-30 mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")" }} />

      <header className="fixed left-[max(1rem,env(safe-area-inset-left))] right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-20 flex items-start justify-between">
        <button className="glass grid h-11 w-11 place-items-center rounded-xl text-white/90"><Icon name="menu" /></button>
        <div className="hidden text-center md:block">
          <div className="text-[12px] font-semibold tracking-[.35em] text-white/90">★ &nbsp;15 AUGUST&nbsp; ★</div>
          <div className="mt-1 text-[10px] tracking-[.5em] text-white/60">HAPPY INDEPENDENCE DAY</div>
        </div>
        <Clock />
      </header>

      <section className="relative z-10 mt-24 flex w-full flex-1 flex-col items-center justify-center px-4 pb-56 pt-10 sm:pb-48">
        <div className="mb-6 text-center sm:hidden">
          <div className="text-[10px] font-semibold tracking-[.3em] text-white/80">★ 15 AUGUST ★</div>
          <h1 className="mt-2 bg-gradient-to-r from-[#f47b20] via-white to-[#3f8f4d] bg-clip-text text-4xl font-black tracking-tight text-transparent">INDEPENDENCE DAY</h1>
        </div>

        <div className="mb-5 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/60" />
            <span className="text-3xl font-semibold italic tracking-tight sm:text-5xl">Awaaz-e-Azaadi</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-white/60" />
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-[.38em] text-white/70 sm:text-xs">Songs that remember India</p>
        </div>

        <div className="mb-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-widest text-white/75 backdrop-blur">
          <Icon name="radio" size={15} /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3f8f4d]" /> ON AIR
        </div>

        <DesktopPlayer track={track} playing={playing} current={current} setCurrent={setCurrent} toggle={toggle} next={() => change(1)} prev={() => change(-1)} liked={liked} setLiked={setLiked} />
        <MobilePlayer track={track} playing={playing} current={current} setCurrent={setCurrent} toggle={toggle} next={() => change(1)} prev={() => change(-1)} />

        <div className="mt-5 w-full max-w-4xl">
          <div className="mb-2 text-center text-sm font-medium">Azaadi Playlist</div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {tracks.map((t, i) => (
              <button key={t.id} onClick={() => { setIndex(i); setCurrent(0); }} className={`glass flex min-w-[190px] flex-1 items-center gap-3 rounded-xl p-2 text-left ${i === index ? "ring-1 ring-white/30" : ""}`}>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#f47b20]/70 via-white/30 to-[#3f8f4d]/70 text-[11px] font-bold">🇮🇳</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold">{t.title}</div>
                  <div className="truncate text-[10px] text-white/55">{t.artist}</div>
                </div>
                <span className="text-[10px] tabular-nums text-white/50">{formatTime(t.duration)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] right-[max(1rem,env(safe-area-inset-right))] z-20 flex items-end justify-between">
        <div className="hidden gap-2 sm:flex">
          {["f", "𝕏", "◎", "▶"].map((x) => <button key={x} className="glass grid h-10 w-10 place-items-center rounded-full text-sm">{x}</button>)}
        </div>
        <div className="mx-auto text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          <div className="text-[8px] uppercase tracking-[.35em] text-white/60">Sare Jahan Se Achha — Hamara Dil Meh Hai</div>
          <div className="mt-1 text-xl italic text-white/90">Happy Independence Day!</div>
          <div className="mt-2 text-[10px] tracking-[.16em] text-white/75">
            <span className="font-serif italic text-white/90">Created by</span>
            <span className="mx-1.5 font-semibold tracking-[.12em] text-transparent bg-clip-text bg-gradient-to-r from-[#f47b20] via-white to-[#3f8f4d]">
              Avinash Sharma
            </span>
            <span className="text-white/35">✦</span>
          </div>
        </div>
        <button className="glass hidden items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:flex"><Icon name="info" size={16} /> About This Station</button>
      </footer>
    </main>
  );
}
