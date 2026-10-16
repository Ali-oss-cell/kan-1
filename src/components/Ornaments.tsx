import { useId, useMemo } from "react";

/** Four-point concave star — the "sparkle" mark from the reference posters. */
export function Sparkle({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z" />
    </svg>
  );
}

/**
 * Halftone dot field. Dot radius grows along a diagonal gradient,
 * mimicking printed halftone screens.
 */
export function Halftone({
  cols = 16,
  rows = 16,
  color = "#92a4ff",
  className = "",
  direction = "br",
}: {
  cols?: number;
  rows?: number;
  color?: string;
  className?: string;
  direction?: "br" | "tl" | "bl" | "tr";
}) {
  const cell = 20;
  const dots = useMemo(() => {
    const out: { x: number; y: number; r: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let nx = col / (cols - 1);
        let ny = row / (rows - 1);
        if (direction === "tl" || direction === "tr") ny = 1 - ny;
        if (direction === "tl" || direction === "bl") nx = 1 - nx;
        // Diagonal ramp — smoothstep keeps the transition punchy.
        const t = Math.min(1, Math.max(0, nx * 0.55 + ny * 0.45));
        const eased = t * t * (3 - 2 * t);
        const r = 1.2 + eased * 7.6;
        out.push({ x: col * cell + cell / 2, y: row * cell + cell / 2, r });
      }
    }
    return out;
  }, [cols, rows, direction]);

  return (
    <svg
      viewBox={`0 0 ${cols * cell} ${rows * cell}`}
      className={className}
      fill={color}
      aria-hidden
      focusable="false"
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} />
      ))}
    </svg>
  );
}

/** Infinite horizontal ticker. Duplicates the list so the loop is seamless. */
export function Marquee({
  items,
  className = "",
  itemClassName = "",
  slow = false,
}: {
  items: readonly string[];
  className?: string;
  itemClassName?: string;
  slow?: boolean;
}) {
  const row = (suffix: string) =>
    items.map((item) => (
      <span
        key={`${suffix}-${item}`}
        className={`flex shrink-0 items-center gap-8 px-4 ${itemClassName}`}
      >
        <span>{item}</span>
        <Sparkle size={20} />
      </span>
    ));

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <div
        className={`flex w-max ${slow ? "animate-marquee-slow" : "animate-marquee"}`}
      >
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

/** Wireframe globe disc — the periwinkle "record" shape from the reference. */
export function WireDisc({
  className = "",
  fill = "#92a4ff",
  line = "#0f0f0f",
}: {
  className?: string;
  fill?: string;
  line?: string;
}) {
  const clipId = useId();
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="49" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="49" fill={fill} />
      <g
        clipPath={`url(#${clipId})`}
        fill="none"
        stroke={line}
        strokeWidth="0.45"
        opacity="0.55"
      >
        {[10, 22, 34, 44].map((rx) => (
          <ellipse key={rx} cx="50" cy="50" rx={rx} ry="49" />
        ))}
        <line x1="50" y1="0" x2="50" y2="100" />
        {[14, 28, 42, 50, 58, 72, 86].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} />
        ))}
        {[18, 34, 50].map((r) => (
          <circle key={r} cx="50" cy="50" r={r} />
        ))}
      </g>
    </svg>
  );
}
