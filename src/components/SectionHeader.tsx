import type { ReactNode } from "react";

/**
 * Consistent section opener: indexed mono label + oversized condensed title
 * on the left, supporting copy / action on the right.
 */
export function SectionHeader({
  index,
  label,
  title,
  children,
  dark = false,
}: {
  index: string;
  label: string;
  title: ReactNode;
  children?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="mb-14 grid grid-cols-1 items-end gap-8 md:mb-20 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-8">
        <div
          data-reveal
          className={`label-lg mb-6 flex items-center gap-4 ${
            dark ? "text-lavender" : "text-ink"
          }`}
        >
          <span
            className={`inline-flex h-8 min-w-8 items-center justify-center border-3 px-2 ${
              dark ? "border-lavender" : "border-ink bg-periwinkle"
            }`}
          >
            {index}
          </span>
          <span>{label}</span>
        </div>
        <h2
          data-reveal
          className={`display text-display-lg ${dark ? "text-paper" : "text-ink"}`}
        >
          {title}
        </h2>
      </div>
      {children ? (
        <div
          data-reveal
          className="lg:col-span-4 lg:justify-self-end lg:text-left"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
