import { type RefObject, useEffect } from "react";

export function useHorizontalScroll(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const track = host.querySelector<HTMLElement>(".scroll_track");
    if (!track) return;

    const onScroll = (): void => {
      const rect = host.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      let progress = -rect.top / totalScrollable;
      progress = Math.max(0, Math.min(1, progress));

      const trackWidth = track.scrollWidth;
      const visibleWidth =
        track.parentElement?.offsetWidth ?? window.innerWidth;
      const maxTranslate = trackWidth - visibleWidth + 100;

      if (maxTranslate > 0) {
        track.style.transform = `translateX(-${progress * maxTranslate}px)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
}
