import { type RefObject, useEffect } from "react";

export function useAutoFitText(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const adjustFontSize = (): void => {
      const parent = el.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      let fontSize = Number.parseFloat(style.fontSize) || 16;
      const minFontSize = 4;
      const tolerance = 1;

      el.style.whiteSpace = "normal";
      el.style.wordBreak = "normal";
      el.style.overflowWrap = "anywhere";
      el.style.fontSize = `${fontSize}px`;

      let elementRect = el.getBoundingClientRect();
      while (
        (elementRect.width - parentRect.width > tolerance ||
          elementRect.height - parentRect.height > tolerance) &&
        fontSize > minFontSize
      ) {
        fontSize -= 1;
        el.style.fontSize = `${fontSize}px`;
        elementRect = el.getBoundingClientRect();
      }
    };

    adjustFontSize();

    let observer: ResizeObserver | undefined;
    if ("ResizeObserver" in window && el.parentElement) {
      observer = new ResizeObserver(adjustFontSize);
      observer.observe(el.parentElement);
    }

    window.addEventListener("resize", adjustFontSize);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", adjustFontSize);
    };
  }, [ref]);
}
