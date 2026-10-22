import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatMonth, shiftMonth, todayISO, type AgendaItem } from "@/dashboard/logic";
import { Empty } from "@/dashboard/ui";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function isoFrom(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function monthCells(ym: string) {
  const [year, month] = ym.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const start = new Date(year, month - 1, 1 - startOffset);
  const total = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const cells: { iso: string; inMonth: boolean }[] = [];
  for (let index = 0; index < total; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    cells.push({ iso: isoFrom(date), inMonth: date.getMonth() === month - 1 });
  }
  return cells;
}

export function MonthCalendar({
  month,
  onMonth,
  items,
  hrefFor,
}: {
  month: string;
  onMonth: (month: string) => void;
  items: AgendaItem[];
  hrefFor?: (item: AgendaItem) => string | undefined;
}) {
  const today = todayISO();
  const [selected, setSelected] = useState(today.startsWith(month) ? today : `${month}-01`);

  useEffect(() => {
    if (!selected.startsWith(month)) {
      setSelected(todayISO().startsWith(month) ? todayISO() : `${month}-01`);
    }
  }, [month, selected]);

  const byDate = new Map<string, AgendaItem[]>();
  for (const item of items) {
    const group = byDate.get(item.date) ?? [];
    group.push(item);
    byDate.set(item.date, group);
  }
  const dayItems = byDate.get(selected) ?? [];

  const pick = (iso: string) => {
    setSelected(iso);
    const nextMonth = iso.slice(0, 7);
    if (nextMonth !== month) onMonth(nextMonth);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-sm btn-paper" onClick={() => onMonth(shiftMonth(month, -1))}>
          Previous
        </button>
        <p className="display min-w-40 text-center text-[28px] leading-none">{formatMonth(month)}</p>
        <button type="button" className="btn btn-sm btn-paper" onClick={() => onMonth(shiftMonth(month, 1))}>
          Next
        </button>
      </div>
      <div className="overflow-x-auto border-3 border-ink bg-paper">
        <div className="grid min-w-[640px] grid-cols-7 [&>*:nth-child(7n)]:border-r-0 [&>*:nth-last-child(-n+7)]:border-b-0">
          {WEEKDAYS.map((day) => (
            <div key={day} className="label border-b-3 border-r-3 border-ink bg-ink px-2 py-3 text-center text-paper">
              {day}
            </div>
          ))}
          {monthCells(month).map((cell) => {
            const events = byDate.get(cell.iso) ?? [];
            const isToday = cell.iso === today;
            const isSelected = cell.iso === selected;
            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => pick(cell.iso)}
                className={`min-h-24 border-b-3 border-r-3 border-ink bg-paper p-2 text-left ${
                  isSelected ? "shadow-[inset_0_-8px_0_#0f0f0f]" : ""
                } ${cell.inMonth ? "" : "text-ink/35"}`}
              >
                <span className={`label block ${isToday ? "underline" : ""}`}>{Number(cell.iso.slice(8))}</span>
                <span className="mt-1 grid gap-1">
                  {events.slice(0, 2).map((item) => (
                    <span key={`${item.kind}-${item.id}`} className="block truncate border-3 border-ink bg-paper px-1 py-0.5 text-[11px] font-bold leading-tight">
                      {item.title}
                    </span>
                  ))}
                  {events.length > 2 ? (
                    <span className="label text-ink/60">+{events.length - 2}</span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <section className="border-3 border-ink bg-paper">
        <h2 className="label-lg border-b-3 border-ink bg-paper px-4 py-3">{formatDate(selected)}</h2>
        {dayItems.length === 0 ? (
          <div className="p-4">
            <Empty>Nothing on this day.</Empty>
          </div>
        ) : (
          <ul>
            {dayItems.map((item) => {
              const href = hrefFor?.(item);
              const body = (
                <>
                  <span className="min-w-0">
                    <span className="label mr-3 text-ink/50">{item.kind}</span>
                    <span className="font-bold">{item.title}</span>
                  </span>
                  <span className="text-small text-ink/70">{item.detail}</span>
                </>
              );
              return (
                <li key={`${item.kind}-${item.id}`} className="border-b-3 border-ink bg-paper last:border-b-0">
                  {href ? (
                    <Link to={href} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                      {body}
                    </Link>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
