import { type RefObject, useEffect } from "react";

interface ScrollBetweenOptions {
  progressVar?: string;
  smoothing?: number;
}

interface BetweenInstance {
  host: HTMLElement;
  startTarget: HTMLElement;
  endTarget: HTMLElement;
  progressVar: string;
  smoothing: number;
  targetProgress: number;
  currentProgress: number;
}

const instances = new Set<BetweenInstance>();
let initialized = false;
let rafId: number | null = null;

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function getPageTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY;
}

function updateTarget(inst: BetweenInstance): void {
  const startY = getPageTop(inst.startTarget);
  const endY = getPageTop(inst.endTarget);
  const total = endY - startY;
  inst.targetProgress =
    total <= 0
      ? window.scrollY >= endY
        ? 1
        : 0
      : clamp((window.scrollY - startY) / total, 0, 1);
}

function animateInstance(inst: BetweenInstance): boolean {
  const smoothing = clamp(inst.smoothing, 0, 1);
  if (smoothing === 0) {
    inst.currentProgress = inst.targetProgress;
    inst.host.style.setProperty(
      inst.progressVar,
      inst.currentProgress.toFixed(4),
    );
    return false;
  }
  const delta = inst.targetProgress - inst.currentProgress;
  if (Math.abs(delta) < 0.001) {
    inst.currentProgress = inst.targetProgress;
    inst.host.style.setProperty(
      inst.progressVar,
      inst.currentProgress.toFixed(4),
    );
    return false;
  }
  inst.currentProgress += delta * smoothing;
  inst.host.style.setProperty(
    inst.progressVar,
    inst.currentProgress.toFixed(4),
  );
  return true;
}

function startLoop(): void {
  if (rafId !== null) return;
  const tick = () => {
    let hasActive = false;
    for (const inst of instances) {
      if (animateInstance(inst)) hasActive = true;
    }
    rafId = hasActive ? requestAnimationFrame(tick) : null;
  };
  rafId = requestAnimationFrame(tick);
}

const onScroll = (): void => {
  for (const inst of instances) updateTarget(inst);
  startLoop();
};
const onResize = (): void => {
  for (const inst of instances) updateTarget(inst);
  startLoop();
};

function ensureSetup(): void {
  if (initialized) return;
  initialized = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
}

function teardown(): void {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  initialized = false;
}

export function useScrollBetween(
  ref: RefObject<HTMLElement | null>,
  startRef: RefObject<HTMLElement | null>,
  endRef: RefObject<HTMLElement | null>,
  options: ScrollBetweenOptions = {},
): void {
  const { progressVar = "--scroll-progress", smoothing = 0.12 } = options;

  useEffect(() => {
    const el = ref.current;
    const startEl = startRef.current;
    const endEl = endRef.current;
    if (!el || !startEl || !endEl) return;

    const inst: BetweenInstance = {
      host: el,
      startTarget: startEl,
      endTarget: endEl,
      progressVar,
      smoothing,
      targetProgress: 0,
      currentProgress: 0,
    };

    instances.add(inst);
    ensureSetup();
    el.style.setProperty(progressVar, "0");
    updateTarget(inst);
    startLoop();

    return () => {
      instances.delete(inst);
      if (instances.size === 0) teardown();
    };
  }, [ref, startRef, endRef, progressVar, smoothing]);
}
