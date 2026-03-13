/**
 * Singleton audio manager for the retro radio.
 * Lives outside React so the audio survives component unmounts
 * (e.g. Room3D unmounting after the cinematic reveal).
 */

let audioCtx: AudioContext | null = null;
let audioEl: HTMLAudioElement | null = null;
let _playing = false;
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach((cb) => cb());
}

/** Subscribe to play/pause changes. Returns unsubscribe function.
 *  Compatible with React's useSyncExternalStore. */
export function subscribe(cb: () => void) {
  _listeners.add(cb);
  return () => {
    _listeners.delete(cb);
  };
}

export function isPlaying() {
  return _playing;
}

/** Lazily create AudioContext + lo-fi chain on first play (needs user gesture). */
function init() {
  if (audioCtx) return;
  const ctx = new AudioContext();
  const audio = new Audio("/audio/radio.mp3");
  audio.loop = true;
  audio.crossOrigin = "anonymous";

  const source = ctx.createMediaElementSource(audio);
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  // Always muffled — lo-fi room sound
  filter.type = "lowpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.8;
  gain.gain.value = 0.35;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  audioCtx = ctx;
  audioEl = audio;
}

export function play() {
  init();
  audioCtx!.resume();
  audioEl!.play().catch(() => {});
  _playing = true;
  notify();
}

export function pause() {
  audioEl?.pause();
  _playing = false;
  notify();
}

export function toggle() {
  if (_playing) pause();
  else play();
}
