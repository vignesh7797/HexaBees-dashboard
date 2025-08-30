// components/Calendar.tsx
"use client";

import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import clsx from "clsx";
import Button from "../Button/Button";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

interface CalendarProps {
  minDate?: Dayjs;
  maxDate?: Dayjs;
  onSelect?: (date: Dayjs | null) => void;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  defaultValue?: Dayjs;
  format?: string;
}

export default function Calendar({
  minDate,
  maxDate,
  onSelect,
  headerContent,
  footerContent,
  defaultValue,
  format = "MMMM YYYY",
}: CalendarProps) {
  const [view, setView] = useState<"day" | "month" | "year">("day");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // Helpers
  const startOfMonth = currentDate.startOf("month");
  const daysInMonth = currentDate.daysInMonth();
  const startDay = startOfMonth.day(); // Sunday = 0
  const yearsRangeStart = Math.floor(currentDate.year() / 10) * 10;

  useEffect(() => {
    if (defaultValue) {
      setSelectedDate(defaultValue);
      setCurrentDate(defaultValue);
    }
  }, [defaultValue]);

  const isDisabled = (date: Dayjs) =>
    (minDate && date.isBefore(minDate, "day")) ||
    (maxDate && date.isAfter(maxDate, "day"));

  const handleSelect = (date: Dayjs) => {
    if (!isDisabled(date)) {
      setSelectedDate(date);
      onSelect?.(date);
    }
  };

  // Helper to decide step unit
  const getStepUnit = () => {
    if (view === "day") return "month";
    if (view === "month") return "year";
    return "year"; // decade navigation: handle separately
  };

  return (
    <div className="w-80 bg-white shadow-lg rounded-2xl p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
        <Button variant="text" severity="secondary" icon={<FaAngleLeft />} onClick={() => {
          if (view === "year") {
            setCurrentDate(currentDate.subtract(10, "year"));
          } else {
            setCurrentDate(currentDate.subtract(1, getStepUnit()));
          }
        }}>

        </Button>
        <div
          className="cursor-pointer font-semibold"
          onClick={() =>
            setView(view === "day" ? "month" : view === "month" ? "year" : "day")
          }
        >
          {view === "day" && (
            <span>
              {currentDate.format("MMMM")} {currentDate.year()}
            </span>
          )}
          {view === "month" && <span>{currentDate.year()}</span>}
          {view === "year" && (
            <span>
              {yearsRangeStart} - {yearsRangeStart + 9}
            </span>
          )}
        </div>
        <Button variant="text" severity="secondary" icon={<FaAngleRight />} onClick={() => {
          if (view === "year") {
            setCurrentDate(currentDate.add(10, "year"));
          } else {
            setCurrentDate(currentDate.add(1, getStepUnit()));
          }
        }}>

        </Button>
      </div>

      {/* Calendar Body */}
      {view === "day" && (
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="text-xs font-semibold text-gray-500">
              {d}
            </div>
          ))}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const date = startOfMonth.add(i, "day");
            return (
              <Button
                size="sm"
                variant={selectedDate?.isSame(date, "day") ? "filled" : "text"}
                severity={selectedDate?.isSame(date, "day") ? "primary" : "secondary"}
                key={i}
                onClick={() => handleSelect(date)}
                disabled={isDisabled(date)}
              >
                {date.date()}
              </Button>
            );
          })}
        </div>
      )}

      {view === "month" && (
        <div className="grid grid-cols-3 gap-2 text-center">
          {Array.from({ length: 12 }).map((_, i) => {
            const date = currentDate.month(i);
            return (
              <Button
                size="sm"
                variant={currentDate.month() === i ? "filled" : "text"}
                severity={currentDate.month() === i ? "primary" : "secondary"}
                key={i}
                disabled={isDisabled(date)}
                onClick={() => {
                  setCurrentDate(date);
                  setView("day");
                }}
              >
                {dayjs().month(i).format("MMM")}
              </Button>
            );
          })}
        </div>
      )}

      {view === "year" && (
        <div className="grid grid-cols-3 gap-2 text-center">
          {Array.from({ length: 10 }).map((_, i) => {
            const year = yearsRangeStart + i;
            return (
              <Button
              size="sm"
              variant={currentDate.year() === year ? "filled" : "text"}
              severity={currentDate.year() === year ? "primary" : "secondary"}
                key={i}
                onClick={() => {
                  setCurrentDate(currentDate.year(year));
                  setView("month");
                }}
              >
                {year}
              </Button>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between border-t border-slate-200 pt-2">
        {footerContent || (
          <>
            <Button
              variant="text"
              onClick={() => {
                const today = dayjs();
                setCurrentDate(today);
                handleSelect(today);
              }}
            >
              Today
            </Button>
            <Button
              variant="text"
              severity="secondary"
              onClick={() => {
                setSelectedDate(null);
                onSelect?.(null);
              }}
            >
              Clear
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
