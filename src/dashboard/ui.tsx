import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { MaterialIcon } from "@/components/MaterialIcon";

const TONE: Record<string, string> = {
  lead: "bg-paper",
  active: "bg-periwinkle",
  paused: "bg-lavender",
  past: "bg-ink text-paper",
  draft: "bg-paper",
  waiting: "bg-lavender",
  delivered: "bg-periwinkle",
  closed: "bg-ink text-paper",
  paid: "bg-periwinkle",
  overdue: "bg-purple",
  partial: "bg-lavender",
  sent: "bg-paper",
  void: "bg-ink text-paper",
  new: "bg-lavender",
  talking: "bg-periwinkle",
  won: "bg-periwinkle",
  lost: "bg-ink text-paper",
  due: "bg-purple",
  cancelled: "bg-ink text-paper",
  blocked: "bg-purple",
  done: "bg-periwinkle",
  not_started: "bg-paper",
  in_progress: "bg-lavender",
  asked: "bg-lavender",
  approved: "bg-periwinkle",
  changes: "bg-purple",
  todo: "bg-paper",
  doing: "bg-lavender",
  accepted: "bg-periwinkle",
  declined: "bg-ink text-paper",
};

export function PageHeading({
  title,
  lede,
  action,
}: {
  title: string;
  lede?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="display text-[40px] leading-none">{title}</h1>
        {lede ? <p className="mt-3 max-w-2xl text-body text-ink/70">{lede}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Status({ value, label }: { value: string; label: string }) {
  return <span className={`tag ${TONE[value] ?? "bg-paper"}`}>{label}</span>;
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="border-3 border-dashed border-ink px-5 py-8 text-body text-ink/70">{children}</p>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="border-3 border-ink bg-purple px-4 py-3 text-small font-medium">
      {message}
    </p>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label mb-2 block">{label}</span>
      {children}
    </label>
  );
}

type ListOption = { value: string; label: string };

function optionLabel(children: ReactNode) {
  if (typeof children === "string" || typeof children === "number") return String(children);
  return "";
}

function readOptions(children: ReactNode): ListOption[] {
  const items: ListOption[] = [];
  const walk = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (!isValidElement<{ value?: string | number; children?: ReactNode; items?: readonly (readonly [string, string])[] }>(child)) {
        return;
      }
      if (child.type === "option") {
        const value = child.props.value == null ? optionLabel(child.props.children) : String(child.props.value);
        items.push({ value, label: optionLabel(child.props.children) || value });
        return;
      }
      if (Array.isArray(child.props.items)) {
        for (const [value, label] of child.props.items) items.push({ value, label });
        return;
      }
      if (child.props.children) walk(child.props.children);
    });
  };
  walk(children);
  return items;
}

export function Select({
  children,
  className = "",
  value,
  disabled,
  required,
  onChange,
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const options = readOptions(children);
  const current = options.find((option) => option.value === String(value ?? ""));
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (next: string) => {
    setOpen(false);
    onChange?.({
      target: { value: next },
      currentTarget: { value: next },
    } as ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={`field flex w-full items-center justify-between gap-3 text-left focus:transform-none ${className}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-required={required || undefined}
        disabled={disabled}
        onClick={() => setOpen((shown) => !shown)}
      >
        <span className="min-w-0 break-words">{current?.label || "Choose"}</span>
        <MaterialIcon name="expand_more" className={`shrink-0 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="relative z-30 mt-2 max-h-64 overflow-y-auto border-3 border-ink bg-paper shadow-brutal-sm"
        >
          {options.map((option) => {
            const selected = option.value === String(value ?? "");
            return (
              <li key={option.value} role="presentation" className="border-b-3 border-ink last:border-b-0">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`w-full px-4 py-3 text-left text-body ${selected ? "bg-paper font-bold" : "bg-paper hover:bg-paper"}`}
                  onClick={() => choose(option.value)}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function Options({ items }: { items: readonly (readonly [string, string])[] }) {
  return items.map(([value, label]) => (
    <option key={value} value={value}>
      {label}
    </option>
  ));
}

export function Stat({
  label,
  value,
  className = "bg-paper",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`border-3 border-ink p-5 shadow-brutal-sm ${className}`}>
      <p className="label mb-3 text-ink/60">{label}</p>
      <p className="break-words font-display text-[28px] font-extrabold leading-none">{value}</p>
    </div>
  );
}
