import {
  setTextDirection,
  useTextDirection,
} from "@/hooks/use-text-direction";
import styles from "./DirectionToggle.module.css";

const OPTIONS = [
  { dir: "ltr", label: "LTR", title: "Left to right" },
  { dir: "rtl", label: "RTL", title: "Right to left" },
] as const;

/** Two-segment switch between left-to-right and right-to-left page layout. */
export function DirectionToggle({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const current = useTextDirection();

  return (
    <div
      role="group"
      aria-label="Page direction"
      className={[styles.toggle, tone === "dark" ? styles.dark : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.dir}
          type="button"
          className={styles.option}
          aria-pressed={current === option.dir}
          title={option.title}
          onClick={() => setTextDirection(option.dir)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
