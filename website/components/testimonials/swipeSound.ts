// Small synthesized sound effects for the phone swipe deck (Web Audio, no files to download).

let ctx: AudioContext | null = null;

/** Create or wake the audio context. Call from a touch/pointer handler so iOS allows sound. */
export function unlockAudio() {
  if (typeof window === "undefined") return;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx ??= new AC();
  if (ctx.state === "suspended") void ctx.resume();
}

/** A soft airy whoosh that travels toward the side the card flies off. */
export function whoosh(dir: number) {
  if (!ctx) return;
  const t = ctx.currentTime, len = 0.38;
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * len), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 0.9;
  band.frequency.setValueAtTime(2400, t);
  band.frequency.exponentialRampToValueAtTime(450, t + len);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.22, t + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + len);
  const pan = ctx.createStereoPanner();
  pan.pan.setValueAtTime(0, t);
  pan.pan.linearRampToValueAtTime(Math.max(-1, Math.min(1, dir)) * 0.8, t + len);
  src.connect(band).connect(gain).connect(pan).connect(ctx.destination);
  src.start(t);
  src.stop(t + len);
}

/** A gentle pop as the next card lands; a right swipe ("loved it") gets a two-note chime. */
export function land(loved: boolean) {
  if (!ctx) return;
  const t = ctx.currentTime + 0.12;
  const notes = loved ? [784, 1175] : [660];
  notes.forEach((f, i) => {
    const o = ctx!.createOscillator(), g = ctx!.createGain();
    const at = t + i * 0.09;
    o.type = "sine";
    o.frequency.setValueAtTime(f * 0.85, at);
    o.frequency.exponentialRampToValueAtTime(f, at + 0.04);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.14, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
    o.connect(g).connect(ctx!.destination);
    o.start(at);
    o.stop(at + 0.25);
  });
}
