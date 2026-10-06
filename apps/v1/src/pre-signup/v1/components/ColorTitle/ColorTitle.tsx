import { useCallback, useRef } from "react";
import styles from "./ColorTitle.module.css";

const WORDS = "navigate next".split(" ");

const WORD_CHARS = WORDS.map((word) => ({
  word,
  chars: word.split("").map((letter, i) => ({ letter, key: `${word}-${i}` })),
}));

const COLORS = [
  "oklch(75% 0.183 55.934)",
  "oklch(82.8% 0.189 84.429)",
  "oklch(90.5% 0.182 98.111)",
  "oklch(84.1% 0.238 128.85)",
  "oklch(79.2% 0.209 151.711)",
  "oklch(76.5% 0.177 163.223)",
  "oklch(77.7% 0.152 181.912)",
  "oklch(78.9% 0.154 211.53)",
  "oklch(74.6% 0.16 232.661)",
  "oklch(70.7% 0.165 254.624)",
  "oklch(67.3% 0.182 276.935)",
  "oklch(70.2% 0.183 293.541)",
  "oklch(71.4% 0.203 305.504)",
  "oklch(74% 0.238 322.16)",
  "oklch(71.8% 0.202 349.761)",
  "oklch(71.2% 0.194 13.428)",
];

const FADE_DELAY = 1500;

function randomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function ColorTitle() {
  const timeoutsRef = useRef(
    new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>(),
  );

  const enter = useCallback((event: React.MouseEvent<HTMLSpanElement>) => {
    const el = event.currentTarget;

    if (el.classList.contains(styles.wobble)) return;

    const existing = timeoutsRef.current.get(el);
    if (existing) clearTimeout(existing);

    el.style.setProperty("--c", randomColor());
    el.classList.add(styles.active);
    el.classList.add(styles.wobble);

    const handler = () => {
      el.classList.remove(styles.wobble);
      const timeout = setTimeout(() => {
        el.classList.remove(styles.active);
        el.style.removeProperty("--c");
        timeoutsRef.current.delete(el);
      }, FADE_DELAY);
      timeoutsRef.current.set(el, timeout);
    };

    el.addEventListener("animationend", handler, { once: true });
  }, []);

  return (
    <h1>
      {WORD_CHARS.map(({ word, chars }) => (
        // Each letter is its own inline-block, which an RTL page would lay out
        // right to left ("ETAGIVAN"); the English words must stay LTR.
        <div key={word} className={styles.word} dir="ltr">
          {chars.map(({ letter, key }) => (
            <span key={key} className={styles.char} onMouseEnter={enter}>
              {letter}
            </span>
          ))}
        </div>
      ))}
    </h1>
  );
}
