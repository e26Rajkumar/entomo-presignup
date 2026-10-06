import { useSyncExternalStore } from "react";

export type TextDirection = "ltr" | "rtl";

/** localStorage key. index.html reads it before first paint so a saved RTL
 *  choice doesn't flash in LTR on load — keep the two in sync. */
const STORAGE_KEY = "presignup-dir";

const listeners = new Set<() => void>();

function getDirection(): TextDirection {
  return document.documentElement.dir === "rtl" ? "rtl" : "ltr";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Sets `<html dir>`, remembers the choice, and re-renders every toggle (the
 *  header renders one for desktop and one in the mobile menu). */
export function setTextDirection(dir: TextDirection) {
  document.documentElement.dir = dir;
  try {
    localStorage.setItem(STORAGE_KEY, dir);
  } catch {
    // Storage unavailable (e.g. private mode): the choice just won't persist.
  }
  for (const listener of listeners) listener();
}

export function useTextDirection(): TextDirection {
  return useSyncExternalStore(subscribe, getDirection, () => "ltr");
}
