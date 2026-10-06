import { type RefObject, useEffect } from "react";

type ThemeSection = {
  element: HTMLElement;
  theme: string;
};

// Module-level singleton — same pattern as Angular's static class members
const sections = new Map<HTMLElement, ThemeSection>();
let activeTheme = "";
let initialized = false;
let ticking = false;

function getDistanceToRange(
  point: number,
  rangeStart: number,
  rangeEnd: number,
): number {
  if (point < rangeStart) return rangeStart - point;
  if (point > rangeEnd) return point - rangeEnd;
  return 0;
}

function updateActiveTheme(): void {
  if (sections.size === 0) return;

  const triggerLine = window.innerHeight * 0.5;

  let containingSection: ThemeSection | null = null;
  let closestSection: ThemeSection | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const section of sections.values()) {
    const rect = section.element.getBoundingClientRect();
    if (rect.height === 0) continue;

    const containsTriggerLine =
      rect.top <= triggerLine && rect.bottom >= triggerLine;
    if (containsTriggerLine) {
      containingSection = section;
      break;
    }

    const dist = getDistanceToRange(triggerLine, rect.top, rect.bottom);
    if (dist < closestDistance) {
      closestDistance = dist;
      closestSection = section;
    }
  }

  const nextTheme = containingSection?.theme ?? closestSection?.theme ?? "";
  if (nextTheme && nextTheme !== activeTheme) {
    activeTheme = nextTheme;
    document.body.setAttribute("data-theme", nextTheme);
  }
}

function scheduleUpdate(): void {
  if (ticking || sections.size === 0) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    updateActiveTheme();
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
  if (!initialized) return;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  initialized = false;
  ticking = false;
  activeTheme = "";
}

export function useThemeScroll(
  ref: RefObject<HTMLElement | null>,
  theme: string,
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || !theme) return;

    sections.set(el, { element: el, theme });
    ensureSetup();
    scheduleUpdate();

    return () => {
      sections.delete(el);
      scheduleUpdate();
      if (sections.size === 0) teardown();
    };
  }, [ref, theme]);
}
