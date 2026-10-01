"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform, type PanInfo } from "framer-motion";
import { useState, useSyncExternalStore, type ReactNode, type Ref } from "react";
import { land, unlockAudio, whoosh } from "./swipeSound";
import s from "./TestimonialWall.module.css";

const SOUND_KEY = "testimonial-sound";

const subscribeStorage = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const readSound = () => {
  try { return localStorage.getItem(SOUND_KEY) !== "off"; } catch { return true; }
};

/** Phone-only deck: drag the top card left or right (or press the button) to throw it off and reveal the next story. */
export default function SwipeDeck({ cards }: { cards: ReactNode[] }) {
  const n = cards.length;
  const [deck, setDeck] = useState({ i: 0, dir: -1 });
  // the visitor's sound choice is remembered in this browser; the server always renders "on"
  const stored = useSyncExternalStore(subscribeStorage, readSound, () => true);
  const [choice, setChoice] = useState<boolean | null>(null);
  const sound = choice ?? stored;
  const [taught, setTaught] = useState(false);
  const reduce = useReducedMotion();

  const toggleSound = () => {
    const on = !sound;
    setChoice(on);
    try { localStorage.setItem(SOUND_KEY, on ? "on" : "off"); } catch {}
  };

  const fling = (dir: number) => {
    setTaught(true);
    if (sound) { unlockAudio(); whoosh(dir); land(dir > 0); }
    setDeck(d => ({ i: (d.i + 1) % n, dir }));
  };

  return (
    <div className={s.deckZone}>
      <div className={s.deck} data-lane="" onPointerDown={() => sound && unlockAudio()}>
        <AnimatePresence initial={false} custom={deck.dir} mode="popLayout">
          <TopCard key={deck.i} reduce={!!reduce} nudge={!taught && deck.i === 0} onFling={fling}>
            {cards[deck.i]}
          </TopCard>
        </AnimatePresence>
        {/* the next two stories wait underneath, fanned slightly */}
        <div className={`${s.under} ${s.under1}`} aria-hidden="true">{cards[(deck.i + 1) % n]}</div>
        <div className={`${s.under} ${s.under2}`} aria-hidden="true">{cards[(deck.i + 2) % n]}</div>
      </div>

      <div className={s.deckControls}>
        <button type="button" className={s.pressMe} onClick={() => fling(-1)}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
          </svg>
          Press me
        </button>
        <button type="button" className={s.soundBtn} onClick={toggleSound} aria-pressed={sound} aria-label={sound ? "Turn sound off" : "Turn sound on"}>
          {sound ? (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H2v6h4l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M19 5a10 10 0 0 1 0 14" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H2v6h4l5 4V5z" /><path d="m22 9-6 6" /><path d="m16 9 6 6" />
            </svg>
          )}
        </button>
      </div>
      <p className={s.deckHint} aria-live="polite">Swipe left or right · Story {deck.i + 1} of {n}</p>
    </div>
  );
}

// the exit reads the direction of the swipe that removed the card (passed through AnimatePresence `custom`)
const variants = {
  enter: { scale: 0.94, y: 14, opacity: 1 },
  center: { scale: 1, y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 320, damping: 24 } },
  exit: (dir: number) => ({ x: dir * 520, rotate: dir * 26, opacity: 0.2, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] as const } }),
  fade: { opacity: 0, transition: { duration: 0.2 } },
};

function TopCard({ children, reduce, nudge, onFling, ref }: {
  children: ReactNode; reduce: boolean; nudge: boolean; onFling: (dir: number) => void; ref?: Ref<HTMLDivElement>;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-16, 0, 16]);
  const loved = useTransform(x, [30, 120], [0, 1]);
  const next = useTransform(x, [-120, -30], [1, 0]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 650) onFling(info.offset.x > 0 ? 1 : -1);
  };

  return (
    <motion.div
      ref={ref}
      className={s.top}
      style={{ x, rotate, touchAction: "pan-y" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={onDragEnd}
      variants={variants}
      initial={reduce ? "fade" : "enter"}
      animate="center"
      exit={reduce ? "fade" : "exit"}
    >
      <div className={nudge && !reduce ? s.nudge : undefined}>
        <motion.span className={`${s.stamp} ${s.stampLove}`} style={{ opacity: loved }} aria-hidden="true">♥ Loved it</motion.span>
        <motion.span className={`${s.stamp} ${s.stampNext}`} style={{ opacity: next }} aria-hidden="true">Next →</motion.span>
        {children}
      </div>
    </motion.div>
  );
}
