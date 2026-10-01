"use client";

import { useEffect, useRef, useState } from "react";
import { TOPIC_LABEL, WALL_ITEMS, type Highlight, type WallItem } from "./data";
import s from "./TestimonialWall.module.css";

const DURATIONS = ["64s", "78s", "70s"];
const FIREWORK_COLORS = ["#5C3A9E", "#7AB648", "#F59E0B", "#C2185B", "#2D6B4F", "#9A7BD4"];

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function HighlightRow({ highlight }: { highlight: Highlight }) {
  return (
    <header className={s.highlight}>
      <Check />
      <span>
        <strong>{highlight[0]}</strong>
        <em>{highlight[1]}</em>
      </span>
    </header>
  );
}

function Card({ item, dup }: { item: WallItem; dup?: boolean }) {
  const hidden = dup ? { "aria-hidden": true } : {};
  if (item.type === "tile") {
    return (
      <article className={`${s.card} ${s.tile} ${dup ? s.dup : ""}`} {...hidden}>
        <div className={s.big}>{item.big}<small>{item.unit}</small></div>
        <p>{item.line}</p>
        <span className={s.src}>From a client’s WhatsApp</span>
      </article>
    );
  }
  if (item.type === "google") {
    return (
      <article className={`${s.card} ${s.review} ${dup ? s.dup : ""}`} {...hidden}>
        <HighlightRow highlight={item.highlight} />
        <div className={s.stars} role="img" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }, (_, i) => (
            <svg key={i} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11.5 2.3a.53.53 0 0 1 .95 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.01a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .3-.9l5.16-.76a2.12 2.12 0 0 0 1.6-1.16z" />
            </svg>
          ))}
        </div>
        <blockquote>“{item.text}”</blockquote>
        <div className={s.name}>
          <span className={s.avatar} style={{ background: item.color }}>{item.initials}</span>
          <span><b>{item.name}</b><em>Google review</em></span>
        </div>
      </article>
    );
  }
  return (
    <article className={`${s.card} ${s.thread} ${dup ? s.dup : ""}`} data-thread="" {...hidden}>
      <HighlightRow highlight={item.highlight} />
      {item.messages.map((m, i) => (
        <div key={i} className={`${s.bubble} ${s.in}`}>
          <div className={s.dots} aria-hidden="true"><i /><i /><i /></div>
          <div className={s.msg}><span>{m}</span></div>
        </div>
      ))}
      {item.reply && (
        <div className={`${s.bubble} ${s.out}`}>
          <span>{item.reply}</span>
          <svg className={s.ticks} data-ticks="" viewBox="0 0 24 24" fill="none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-label="Read">
            <path d="M18 6 7 17l-5-5" />
            <path d="m22 10-7.5 7.5L13 16" />
          </svg>
        </div>
      )}
      <footer className={s.who}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
        <span>WhatsApp · client</span>
        <span className={s.tag}>{TOPIC_LABEL[item.topic]}</span>
      </footer>
    </article>
  );
}

export default function TestimonialWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const [columns, setColumns] = useState(3);

  // phones get two sideways rows instead of three columns
  useEffect(() => {
    const mq = matchMedia("(max-width: 760px)");
    const update = () => setColumns(mq.matches ? 2 : 3);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // the one authored moment: top messages type in, replies land, then the wall drifts; fireworks behind it
  useEffect(() => {
    const section = sectionRef.current, wall = wallRef.current, sky = skyRef.current;
    if (!section || !wall || !sky) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wall.classList.add(s.live);
      return;
    }
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    const ctx = sky.getContext("2d")!;
    type Rocket = { x: number; y: number; vx: number; vy: number; c: string; t: number };
    type Spark = { x: number; y: number; px: number; py: number; vx: number; vy: number; c: string; life: number; age: number; crackle: boolean };
    let W = 0, H = 0, rockets: Rocket[] = [], sparks: Spark[] = [];
    let running = false, onScreen = false, nextAt = 0, raf = 0;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = () => FIREWORK_COLORS[(Math.random() * FIREWORK_COLORS.length) | 0];
    const small = () => W < 760;

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = section.clientWidth; H = section.clientHeight;
      sky.width = W * dpr; sky.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(size);
    ro.observe(section);
    size();

    const rel = (el: Element) => {
      const r = el.getBoundingClientRect(), o = section.getBoundingClientRect();
      return { l: r.left - o.left, r: r.right - o.left, t: r.top - o.top, b: r.bottom - o.top };
    };
    // open sky only: the band above the wall and the band around the button, never over the cards
    const target = (): [number, number, number] => {
      const head = rel(section.querySelector("h2")!), w = rel(wall), after = rel(section.querySelector(`.${s.after}`)!);
      const top = Math.random() < .75;
      const y0 = top ? 40 : w.b + 30, y1 = top ? w.t - 50 : Math.min(H - 40, after.b + 40);
      const block = top ? head : after;
      for (let i = 0; i < 10; i++) {
        const x = rand(W * .06, W * .94), y = rand(y0, Math.max(y0 + 10, y1));
        const overText = !small() && x > block.l - 70 && x < block.r + 70 && y > block.t - 50 && y < block.b + 50;
        if (!overText) return [x, y, top ? w.t + 140 : H + 10];
      }
      return [rand(W * .06, W * .22), rand(60, Math.max(70, w.t - 80)), w.t + 140];
    };
    const launch = () => {
      const [tx, ty, from] = target();
      const x = tx + rand(-50, 50);
      rockets.push({ x, y: from, vx: (tx - x) / 48, vy: (ty - from) / 48, c: pick(), t: 0 });
    };
    const burst = (r: Rocket) => {
      const n = small() ? 54 : 90, c2 = pick(), ring = Math.random() < .35;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rand(-.05, .05), sp = ring ? rand(3.6, 4) : rand(1, 4.4);
        sparks.push({ x: r.x, y: r.y, px: r.x, py: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          c: i % 3 ? r.c : c2, life: rand(55, 85), age: 0, crackle: Math.random() < .25 });
      }
    };
    const frame = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      if (onScreen && now > nextAt) {
        launch();
        if (Math.random() < .35) later(launch, 220);
        nextAt = now + rand(2600, 5200);
      }
      ctx.lineCap = "round";
      rockets = rockets.filter(r => {
        r.t++; r.x += r.vx; r.y += r.vy;
        ctx.globalAlpha = .9; ctx.strokeStyle = r.c; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(r.x - r.vx * 3, r.y - r.vy * 3); ctx.lineTo(r.x, r.y); ctx.stroke();
        if (r.t >= 48) { burst(r); return false; }
        return true;
      });
      sparks = sparks.filter(p => {
        p.age++; p.px = p.x; p.py = p.y;
        p.vx *= .965; p.vy = p.vy * .965 + .045; p.x += p.vx; p.y += p.vy;
        const k = 1 - p.age / p.life;
        if (k <= 0) return false;
        ctx.globalAlpha = Math.min(1, k * 1.3);
        ctx.strokeStyle = p.c; ctx.lineWidth = 2.4 * k + .6;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
        if (p.crackle && k < .45 && Math.random() < .5) { // firecracker glitter at the end of a spark
          ctx.globalAlpha = Math.min(1, k * 1.6); ctx.fillStyle = "#F59E0B";
          ctx.fillRect(p.x + rand(-3, 3), p.y + rand(-3, 3), 1.6, 1.6);
        }
        return true;
      });
      ctx.globalAlpha = 1;
      if (onScreen || rockets.length || sparks.length) raf = requestAnimationFrame(frame);
      else running = false;
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };

    const seen = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting && !document.hidden;
      if (onScreen) start();
    }, { threshold: .15 });
    seen.observe(section);
    const onVisibility = () => { if (document.hidden) onScreen = false; };
    document.addEventListener("visibilitychange", onVisibility);

    const intro = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      intro.disconnect();
      [0, 260, 520, 900, 1250].forEach(d => later(launch, d));
      nextAt = performance.now() + 4000;
      start();
      const firsts = [...wall.querySelectorAll(`.${s.track}`)]
        .map(t => t.querySelector<HTMLElement>("[data-thread]"))
        .filter((c): c is HTMLElement => !!c);
      firsts.forEach((c, i) => {
        c.classList.add(s.typing);
        later(() => c.classList.remove(s.typing), 1400 + i * 500);
        later(() => c.querySelector("[data-ticks]")?.classList.add(s.read), 2600 + i * 500);
      });
      later(() => wall.classList.add(s.live), 3600);
    }, { threshold: .25 });
    intro.observe(wall);

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      ro.disconnect(); seen.disconnect(); intro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const cols: WallItem[][] = Array.from({ length: columns }, () => []);
  WALL_ITEMS.forEach((item, i) => cols[i % columns].push(item));

  return (
    <section ref={sectionRef} id="testimonials" className={s.section} aria-labelledby="testimonials-title">
      <canvas ref={skyRef} className={s.sky} aria-hidden="true" />
      <div className={s.inner}>
        <div className={s.head}>
          <h2 id="testimonials-title">Their Words. <span>Their Wins.</span></h2>
          <p>Feedback clients sent us during their programmes, shared with permission. Names are hidden for privacy.</p>
        </div>
        <div ref={wallRef} className={s.wall}>
          {[0, 1, 2].map(c => (
            <div key={c} className={s.col}>
              <div className={s.track} style={{ ["--dur" as string]: DURATIONS[c] }}>
                {(cols[c] ?? []).map((item, i) => <Card key={i} item={item} />)}
                {(cols[c] ?? []).map((item, i) => <Card key={`d${i}`} item={item} dup />)}
              </div>
            </div>
          ))}
        </div>
        <div className={s.after}>
          <a className={s.cta} href="#contact">Book Free Consultation</a>
          <span className={s.note}>Plus 5-star reviews from clients on Google</span>
        </div>
      </div>
    </section>
  );
}
