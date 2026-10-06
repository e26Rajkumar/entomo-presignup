import { useEffect, useState } from "react";

/**
 * Returns `value` after it has been stable for `delayMs`. Used to keep
 * per-keystroke state (e.g. the field search input) from fanning out into
 * one network request per character.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
