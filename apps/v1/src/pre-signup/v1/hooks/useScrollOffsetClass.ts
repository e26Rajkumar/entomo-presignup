import { type RefObject, useEffect } from "react";

interface ScrollOffsetClassOptions {
  activeClass: string;
  inactiveClass?: string;
  scrollOffset?: number;
  scrollOffsetOnce?: boolean;
}

interface OffsetInstance {
  host: HTMLElement;
  activeClass: string;
  inactiveClass: string;
  scrollOffset: number;
  scrollOffsetOnce: boolean;
  isActive: boolean;
  hasActivatedOnce: boolean;
}

const instances = new Set<OffsetInstance>();
let initialized = false;
let ticking = false;

function updateInstance(inst: OffsetInstance): void {
  if (inst.scrollOffsetOnce && inst.hasActivatedOnce) return;

  const isNowActive = window.scrollY > Math.max(0, inst.scrollOffset);

  if (isNowActive && !inst.isActive) {
    inst.isActive = true;
    inst.hasActivatedOnce = true;
    if (inst.inactiveClass) inst.host.classList.remove(inst.inactiveClass);
    inst.host.classList.add(inst.activeClass);
  } else if (
    !isNowActive &&
    inst.isActive &&
    !(inst.scrollOffsetOnce && inst.hasActivatedOnce)
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

export function useScrollOffsetClass(
  ref: RefObject<HTMLElement | null>,
  options: ScrollOffsetClassOptions,
): void {
  const {
    activeClass,
    inactiveClass = "",
    scrollOffset = 0,
    scrollOffsetOnce = false,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !activeClass) return;

    const inst: OffsetInstance = {
      host: el,
      activeClass,
      inactiveClass,
      scrollOffset,
      scrollOffsetOnce,
      isActive: false,
      hasActivatedOnce: false,
    };

    if (inactiveClass) el.classList.add(inactiveClass);

    instances.add(inst);
    ensureSetup();
    scheduleUpdate();

    return () => {
      instances.delete(inst);
      if (instances.size === 0) teardown();
    };
  }, [ref, activeClass, inactiveClass, scrollOffset, scrollOffsetOnce]);
}
