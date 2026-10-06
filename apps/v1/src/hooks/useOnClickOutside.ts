import { type RefObject, useEffect, useRef } from "react";

// Calls `handler` when a pointer/touch press lands outside the referenced
// element — the standard way to dismiss a popover/menu. Only listens while
// `enabled` is true so a closed popover adds no document-level listeners. Uses
// `mousedown`/`touchstart` (not `click`) so it fires before a re-render can
// detach the target, and so it co-operates with the `onMouseDown` handlers our
// menu items already use.
export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled = true,
): void {
  // Hold the latest `handler` in a ref so callers can pass an inline arrow
  // without re-attaching the document listeners on every render — the effect
  // only re-runs when `enabled` (or `ref`) changes, and the listener always
  // calls the current handler.
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handlerRef.current();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, enabled]);
}
