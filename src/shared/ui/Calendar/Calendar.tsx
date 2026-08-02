"use client";

import { ReactNode } from "react";

interface CalendarProps {
  month: Date;
  onMonthChange: (month: Date) => void;
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  isDateDisabled?: (date: Date) => boolean;
  renderDay?: (date: Date) => ReactNode;
  locale?: string;
  minMonth?: Date;
  maxMonth?: Date;
}

const WEEKDAY_LABELS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const WEEKDAY_LABELS_KG = ["Дш", "Шш", "Шр", "Бш", "Жм", "Иш", "Жк"];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function getMonthGrid(month: Date): Date[] {
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

export function Calendar({
  month,
  onMonthChange,
  selected,
  onSelect,
  isDateDisabled,
  renderDay,
  locale = "ru",
  minMonth,
  maxMonth,
}: CalendarProps) {
  const days = getMonthGrid(month);
  const weekdayLabels = locale === "kg" ? WEEKDAY_LABELS_KG : WEEKDAY_LABELS_RU;
  const monthLabel = new Intl.DateTimeFormat(
    locale === "kg" ? "ky-KG" : "ru-RU",
    { month: "long", year: "numeric" },
  ).format(month);

  const canGoPrev =
    !minMonth ||
    new Date(month.getFullYear(), month.getMonth() - 1, 1) >=
      new Date(minMonth.getFullYear(), minMonth.getMonth(), 1);
  const canGoNext =
    !maxMonth ||
    new Date(month.getFullYear(), month.getMonth() + 1, 1) <=
      new Date(maxMonth.getFullYear(), maxMonth.getMonth(), 1);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          aria-label="Предыдущий месяц"
          disabled={!canGoPrev}
          onClick={() =>
            onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
          className="flex h-11 w-11 items-center justify-center rounded-lg text-gold hover:bg-hover disabled:opacity-30"
        >
          ←
        </button>
        <span className="font-heading capitalize text-text">{monthLabel}</span>
        <button
          type="button"
          aria-label="Следующий месяц"
          disabled={!canGoNext}
          onClick={() =>
            onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
          className="flex h-11 w-11 items-center justify-center rounded-lg text-gold hover:bg-hover disabled:opacity-30"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-muted">
        {weekdayLabels.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const outsideMonth = !isSameMonth(day, month);
          const disabled = isDateDisabled?.(day) ?? false;
          const isSelected = selected ? isSameDay(day, selected) : false;

          return (
            <button
              type="button"
              key={day.toISOString()}
              disabled={disabled || outsideMonth}
              onClick={() => onSelect?.(day)}
              className={`relative flex h-11 w-11 flex-col items-center justify-center rounded-lg text-sm transition-colors ${
                outsideMonth
                  ? "invisible"
                  : disabled
                    ? "cursor-not-allowed text-text-muted/40 line-through"
                    : isSelected
                      ? "bg-gold text-on-gold font-medium"
                      : "text-text hover:bg-hover"
              }`}
            >
              {day.getDate()}
              {renderDay?.(day)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
