import {
  setTextDirection,
  useTextDirection,
} from "@/hooks/use-text-direction";

const OPTIONS = [
  { dir: "ltr", label: "LTR", title: "Left to right" },
  { dir: "rtl", label: "RTL", title: "Right to left" },
] as const;

/** Two-segment switch between left-to-right and right-to-left page layout. */
export const DirectionToggle = ({ className }: { className?: string }) => {
  const current = useTextDirection();

  return (
    <div
      role="group"
      aria-label="Page direction"
      className={["dir-toggle", className].filter(Boolean).join(" ")}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.dir}
          type="button"
          className="dir-toggle-option"
          aria-pressed={current === option.dir}
          title={option.title}
          onClick={() => setTextDirection(option.dir)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
