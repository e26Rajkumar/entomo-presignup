import { useEffect, useState } from "react";

// Debounce a fast-changing value (every keystroke) so downstream effects only
// run after the user pauses. 250 ms is short enough to feel responsive and
// long enough to coalesce a typing burst.
export function useDebouncedValue<T>(value: T, delayMs = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}
