/**
 * Inline SVG icon set — square caps and miter joins to match the neo-brutalist
 * stroke language. No icon-font download, so nothing flashes or shifts on load.
 * Size is controlled with font-size (1em box), colour with `currentColor`.
 */
const paths = {
  arrow_outward: "M7 17L17 7M8 7h9v9",
  south: "M12 4v16M5 13l7 7 7-7",
  north: "M12 20V4M5 11l7-7 7 7",
  menu: "M3 6h18M3 12h18M3 18h18",
  close: "M5 5l14 14M19 5L5 19",
  mail: "M3 5h18v14H3zM3 6l9 8 9-8",
  check: "M4 12.5l5 5L20 6.5",
  expand_more: "M5 9l7 7 7-7",
  trending_up: "M3 17l6-6 4 4 8-8M15 7h6v6",
  terminal: "M3 4h18v16H3zM7 9l3 3-3 3M13 15h4",
  campaign: "M4 9v6h3.5L15 20V4L7.5 9H4zM19 9.5a4 4 0 0 1 0 5",
  draw: "M4 20l1-5L16 4l4 4L9 19l-5 1zM14 6l4 4",
  auto_awesome:
    "M12 2C12 8 16 12 22 12C16 12 12 16 12 22C12 16 8 12 2 12C8 12 12 8 12 2Z",
  palette:
    "M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-.5-1.5-.5-2.5S14.5 15 16 15h2a3 3 0 0 0 3-3 9 9 0 0 0-9-9zM7.5 11h.01M10 7.5h.01M14.5 7.5h.01",
  language:
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  public:
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  hub: "M9 9h6v6H9zM12 9V4M12 15v5M9 12H4M15 12h5",
  schedule: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  architecture: "M4 20L12 4l8 16M7.5 13h9M3 20h18",
  handshake:
    "M9 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM15 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z",
} as const;

export type IconName = keyof typeof paths;

export function MaterialIcon({
  name,
  className = "",
  "aria-hidden": ariaHidden,
}: {
  name: string;
  className?: string;
  "aria-hidden"?: boolean;
}) {
  const d = paths[name as IconName];
  if (!d) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={`icon ${className}`.trim()}
      aria-hidden={ariaHidden ?? true}
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
