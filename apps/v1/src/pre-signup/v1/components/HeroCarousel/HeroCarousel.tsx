import { useCallback, useEffect, useState } from "react";
import styles from "./HeroCarousel.module.css";
import { assetUrl } from "@/lib/asset-url";

const hero = (file: string) => assetUrl(`/assets/images/hero/${file}`);

const SLIDES = [
  { src: hero("port-and-industry.jpg"), label: "Port and industry" },
  { src: hero("sunrise-over-muscat.jpg"), label: "Sunrise over Muscat" },
  { src: hero("village-at-dusk.jpg"), label: "Village at dusk" },
  { src: hero("wadi-oasis.jpg"), label: "Wadi oasis" },
  { src: hero("business-district.jpg"), label: "Business district" },
  {
    src: hero("golden-oasis-village.jpg"),
    label: "Oasis village in the mountains",
    // Portrait source: keep the village (upper-middle) in a landscape crop.
    position: "center 35%",
  },
  { src: hero("mutrah-corniche.jpg"), label: "Mutrah Corniche" },
];

const INTERVAL_MS = 6000;

/** Current slide plus a setter; advances on a timer that restarts after every
 *  change, so picking a slide by hand gives it a full interval on screen. */
export function useHeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      INTERVAL_MS,
    );
    return () => window.clearTimeout(timer);
  }, [index]);

  const goTo = useCallback((i: number) => setIndex(i), []);
  return { index, goTo };
}

/** Cross-fading full-bleed backdrop. Purely decorative (the hero copy carries
 *  the content), so it is hidden from assistive tech. Each photo is only
 *  requested once it is showing or up next. */
export function HeroCarouselSlides({ index }: { index: number }) {
  const [mounted, setMounted] = useState(() => new Set([0, 1]));

  useEffect(() => {
    setMounted((prev) => {
      const next = (index + 1) % SLIDES.length;
      if (prev.has(index) && prev.has(next)) return prev;
      return new Set(prev).add(index).add(next);
    });
  }, [index]);

  return (
    <div className={styles.slides} aria-hidden="true">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`${styles.slide} ${i === index ? styles.active : ""}`}
        >
          {mounted.has(i) && (
            <img
              src={slide.src}
              alt=""
              decoding="async"
              style={
                slide.position ? { objectPosition: slide.position } : undefined
              }
            />
          )}
        </div>
      ))}
      <div className={styles.scrim} />
    </div>
  );
}

export function HeroCarouselDots({
  index,
  onSelect,
}: {
  index: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className={styles.dots}>
      {SLIDES.map((slide, i) => (
        <button
          key={slide.src}
          type="button"
          className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
          aria-label={`Show ${slide.label}`}
          aria-current={i === index}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}
