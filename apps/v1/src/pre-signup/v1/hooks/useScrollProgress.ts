import { type RefObject, useEffect } from "react";

interface ScrollProgressOptions {
  start?: string;
  end?: string;
  startOffset?: number;
  endOffset?: number;
  progressVar?: string;
  smoothing?: number;
}

interface ProgressInstance {
  host: HTMLElement;
  start: string;
  end: string;
  startOffset: number;
  endOffset: number;
  progressVar: string;
  smoothing: number;
  targetProgress: number;
  currentProgress: number;
}

const instances = new Set<ProgressInstance>();
let initialized = false;
let rafId: number | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function resolveViewportPosition(value: string, vh: number): number {
  const parts = value.trim().split(/\s+/);
  const viewportPart = (parts.length >= 2 ? parts[1] : parts[0]).toLowerCase();

  if (viewportPart === "top") return 0;
  if (viewportPart === "center" || viewportPart === "middle") return vh * 0.5;
  if (viewportPart === "bottom") return vh;
  if (viewportPart.endsWith("%"))
    return vh * (Number.parseFloat(viewportPart) / 100);
  if (viewportPart.endsWith("px")) return Number.parseFloat(viewportPart);
  return Number.parseFloat(viewportPart) || 0;
}

function resolveElementAnchor(value: string, rect: DOMRect): number {
  const anchor = value.trim().split(/\s+/)[0];
  if (anchor === "bottom") return rect.bottom;
  if (anchor === "center") return rect.top + rect.height / 2;
  return rect.top;
}

function updateTargetProgress(inst: ProgressInstance): void {
  const rect = inst.host.getBoundingClientRect();
  const vh = window.innerHeight;

  if (rect.height <= 0 && rect.width <= 0) {
    inst.targetProgress = 0;
    return;
  }

  const startLine =
    resolveViewportPosition(inst.start, vh) - Math.max(0, inst.startOffset);
  const endLine =
    resolveViewportPosition(inst.end, vh) + Math.max(0, inst.endOffset);
  const startAnchor = resolveElementAnchor(inst.start, rect);
  const endAnchor = resolveElementAnchor(inst.end, rect);
  const totalDistance = startLine - endLine + (endAnchor - startAnchor);

  if (Math.abs(totalDistance) <= 1e-6) {
    inst.targetProgress = startAnchor <= startLine ? 1 : 0;
  } else {
    inst.targetProgress = clamp(
      (startLine - startAnchor) / totalDistance,
      0,
      1,
    );
  }
}

function animateInstance(inst: ProgressInstance): boolean {
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
  for (const inst of instances) updateTargetProgress(inst);
  startLoop();
};

const onResize = (): void => {
  for (const inst of instances) updateTargetProgress(inst);
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

export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  options: ScrollProgressOptions = {},
): void {
  const {
    start = "top 100%",
    end = "bottom 100%",
    startOffset = 0,
    endOffset = 0,
    progressVar = "--scroll-progress",
    smoothing = 0.12,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const inst: ProgressInstance = {
      host: el,
      start,
      end,
      startOffset,
      endOffset,
      progressVar,
      smoothing,
      targetProgress: 0,
      currentProgress: 0,
    };

    instances.add(inst);
    ensureSetup();
    el.style.setProperty(progressVar, "0");
    updateTargetProgress(inst);
    startLoop();

    return () => {
      instances.delete(inst);
      if (instances.size === 0) teardown();
    };
  }, [ref, start, end, startOffset, endOffset, progressVar, smoothing]);
}
