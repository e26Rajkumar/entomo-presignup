import { useEffect, useRef } from "react";
import styles from "./InteractiveGrid.module.css";

interface GridBlock {
  x: number;
  y: number;
  color: string;
  alpha: number;
  phase: "idle" | "in" | "delay" | "out";
  timer: number;
}

interface Props {
  gridBackground?: string;
  gridSizeDesktop?: number;
  gridSizeMobile?: number;
  gridBorderSize?: number;
  gridBorderColor?: string;
}

const OPACITIES = [0.15, 0.12, 0.1, 0.07, 0.05, 0.03];

export function InteractiveGrid({
  gridBackground = "transparent",
  gridSizeDesktop = 32,
  gridSizeMobile = 12,
  gridBorderSize = 0,
  gridBorderColor = "transparent",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (prefersReducedMotion.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let cols = 0;
    let rows = 0;
    let squareSize = 0;
    let blocks: GridBlock[] = [];
    let trailQueue: GridBlock[] = [];
    let lastHovered: number | null = null;
    let colorPointer = 0;
    let gridColors: string[] = [];
    let lastFrameTime = 0;

    function debounce<T extends (...args: unknown[]) => void>(
      fn: T,
      wait: number,
    ): T {
      let timeout: ReturnType<typeof setTimeout>;
      return ((...args: unknown[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), wait);
      }) as T;
    }

    function resolveThemeColors(): void {
      let themeVal =
        getComputedStyle(document.body).getPropertyValue("--theme").trim() ||
        getComputedStyle(document.documentElement)
          .getPropertyValue("--theme")
          .trim();

      if (!themeVal) {
        themeVal =
          getComputedStyle(document.body)
            .getPropertyValue("--_theme---text")
            .trim() ||
          getComputedStyle(document.documentElement)
            .getPropertyValue("--_theme---text")
            .trim() ||
          "#000000";
      }

      const tempEl = document.createElement("div");
      tempEl.style.color = themeVal;
      document.body.appendChild(tempEl);
      const resolvedColor = getComputedStyle(tempEl).color;
      document.body.removeChild(tempEl);

      const match = resolvedColor.match(/\d+/g);
      if (match && match.length >= 3) {
        const [r, g, b] = match.map(Number);
        gridColors = OPACITIES.map((a) => `rgba(${r},${g},${b},${a})`);
      } else {
        gridColors = OPACITIES.map((a) => `rgba(0,0,0,${a})`);
      }
    }

    function setupGrid(): void {
      const parent = canvas?.parentElement;
      if (!parent) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      cols = window.innerWidth < 768 ? gridSizeMobile : gridSizeDesktop;
      squareSize = canvas.width / cols;
      rows = Math.ceil(canvas.height / squareSize);

      blocks = [];
      trailQueue = [];
      lastHovered = null;
      colorPointer = 0;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          blocks.push({
            x: x * squareSize,
            y: y * squareSize,
            color: "#fff",
            alpha: 0,
            phase: "idle",
            timer: 0,
          });
        }
      }
    }

    function draw(timestamp: number): void {
      if (!ctx || !canvas) return;
      if (!lastFrameTime) lastFrameTime = timestamp;
      const dt = timestamp - lastFrameTime;
      lastFrameTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const b of blocks) {
        if (b.phase !== "idle") {
          b.timer += dt;
          if (b.phase === "in") {
            b.alpha = Math.min(1, b.timer / 100);
            if (b.timer >= 100) {
              b.phase = "delay";
              b.timer = 0;
            }
          } else if (b.phase === "delay") {
            if (b.timer >= 500) {
              b.phase = "out";
              b.timer = 0;
            }
          } else if (b.phase === "out") {
            b.alpha = Math.max(0, 1 - b.timer / 2000);
            if (b.timer >= 2000) {
              b.phase = "idle";
              b.alpha = 0;
            }
          }
        }

        if (b.alpha > 0) {
          ctx.fillStyle = b.color;
          ctx.globalAlpha = b.alpha;
          ctx.fillRect(b.x, b.y, squareSize, squareSize);
        }

        ctx.globalAlpha = 1;
        if (gridBorderSize > 0) {
          ctx.lineWidth = gridBorderSize;
          ctx.strokeStyle = gridBorderColor;
          ctx.strokeRect(b.x, b.y, squareSize, squareSize);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    function supportsTouch(): boolean {
      return "ontouchstart" in window || navigator.maxTouchPoints > 1;
    }

    resolveThemeColors();

    const themeObserver = new MutationObserver(
      debounce(resolveThemeColors, 50),
    );
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    setupGrid();
    animationFrameId = requestAnimationFrame(draw);

    const debouncedSetupGrid = debounce(setupGrid, 200);
    window.addEventListener("resize", debouncedSetupGrid);

    let mouseMoveListener: ((e: MouseEvent) => void) | undefined;
    if (!supportsTouch()) {
      mouseMoveListener = (e: MouseEvent) => {
        const r = canvas?.getBoundingClientRect();
        const mx = e.clientX;
        const my = e.clientY;
        if (mx < r.left || mx > r.right || my < r.top || my > r.bottom) return;

        const xIdx = Math.floor((mx - r.left) / squareSize);
        const yIdx = Math.floor((my - r.top) / squareSize);
        const idx = yIdx * cols + xIdx;

        if (idx !== lastHovered && blocks[idx]) {
          const b = blocks[idx];
          b.color = gridColors[colorPointer];
          colorPointer = (colorPointer + 1) % gridColors.length;
          b.phase = "in";
          b.timer = 0;

          trailQueue.push(b);
          if (trailQueue.length > gridColors.length) {
            const old = trailQueue.shift();
            if (old) {
              old.phase = "idle";
              old.alpha = 0;
            }
          }
          lastHovered = idx;
        }
      };
      document.addEventListener("mousemove", mouseMoveListener);
    }

    const prefersReducedMotionListener = (e: MediaQueryListEvent) => {
      if (e.matches) {
        cancelAnimationFrame(animationFrameId);
        ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
      } else {
        setupGrid();
        lastFrameTime = 0;
        animationFrameId = requestAnimationFrame(draw);
      }
    };
    prefersReducedMotion.addEventListener(
      "change",
      prefersReducedMotionListener,
    );

    return () => {
      cancelAnimationFrame(animationFrameId);
      themeObserver.disconnect();
      window.removeEventListener("resize", debouncedSetupGrid);
      if (mouseMoveListener)
        document.removeEventListener("mousemove", mouseMoveListener);
      prefersReducedMotion.removeEventListener(
        "change",
        prefersReducedMotionListener,
      );
    };
  }, [gridSizeDesktop, gridSizeMobile, gridBorderSize, gridBorderColor]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      style={{ backgroundColor: gridBackground }}
    />
  );
}
