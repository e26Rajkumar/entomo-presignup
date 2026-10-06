import { type RefObject, useEffect } from "react";

interface ScrollActivateClassOptions {
  activeClass: string;
  inactiveClass?: string;
  start?: string;
  end?: string;
  activateOnce?: boolean;
}

interface ActivateInstance {
  host: HTMLElement;
  activeClass: string;
  inactiveClass: string;
  start: string;
  end: string;
  activateOnce: boolean;
  isActive: boolean;
  hasActivatedOnce: boolean;
}

const instances = new Set<ActivateInstance>();
let initialized = false;
let ticking = false;

function resolveViewportPosition(value: string, vh: number): number {
  const parts = value.trim().split(/\s+/);
  if (parts.length < 2) return 0;
  const vp = parts[1];
  if (vp.endsWith("%")) return vh * (Number.parseFloat(vp) / 100);
  if (vp.endsWith("px")) return Number.parseFloat(vp);
  return 0;
}

function resolveElementAnchor(value: string, rect: DOMRect): number {
  const anchor = value.trim().split(/\s+/)[0];
  if (anchor === "bottom") return rect.bottom;
  if (anchor === "center") return rect.top + rect.height / 2;
  return rect.top;
}

function updateInstance(inst: ActivateInstance): void {
  if (inst.activateOnce && inst.hasActivatedOnce) return;

  const rect = inst.host.getBoundingClientRect();
  const vh = window.innerHeight;
  if (rect.height <= 0) return;

  const startLine = resolveViewportPosition(inst.start, vh);
  const endLine = resolveViewportPosition(inst.end, vh);
  const elementStart = resolveElementAnchor(inst.start, rect);
  const elementEnd = resolveElementAnchor(inst.end, rect);
  const isNowActive = elementStart <= startLine && elementEnd > endLine;

  if (isNowActive && !inst.isActive) {
    inst.isActive = true;
    inst.hasActivatedOnce = true;
    if (inst.inactiveClass) inst.host.classList.remove(inst.inactiveClass);
    inst.host.classList.add(inst.activeClass);
  } else if (
    !isNowActive &&
    inst.isActive &&
    !(inst.activateOnce && inst.hasActivatedOnce)
  ) {
    inst.isActive = false;
    inst.host.classList.remove(inst.activeClass);
    if (inst.inactiveClass) inst.host.classList.add(inst.inactiveClass);
  }
}

function scheduleUpdate(): void {
  if (ticking || instances.size === 0) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    for (const inst of instances) updateInstance(inst);
  });
}

const onScroll = (): void => scheduleUpdate();
const onResize = (): void => scheduleUpdate();

function ensureSetup(): void {
  if (initialized) return;
  initialized = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
}

function teardown(): void {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  initialized = false;
  ticking = false;
}

export function useScrollActivateClass(
  ref: RefObject<HTMLElement | null>,
  options: ScrollActivateClassOptions,
): void {
  const {
    activeClass,
    inactiveClass = "",
    start = "top 40%",
    end = "bottom 0px",
    activateOnce = false,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !activeClass.trim()) return;

    const inst: ActivateInstance = {
      host: el,
      activeClass,
      inactiveClass,
      start,
      end,
      activateOnce,
      isActive: false,
      hasActivatedOnce: false,
    };

    if (inactiveClass.trim()) el.classList.add(inactiveClass);

    instances.add(inst);
    ensureSetup();
    scheduleUpdate();

    return () => {
      instances.delete(inst);
      if (instances.size === 0) teardown();
    };
  }, [ref, activeClass, inactiveClass, start, end, activateOnce]);
}
