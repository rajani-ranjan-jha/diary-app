import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { IDiary } from "@/models/Diary";

interface DatePickerProps {
  //   selectedDate?: Date | null;
  //   onChange?: (date: Date) => void;
  diary: IDiary;
  onUpdate: (updated: IDiary) => void;
}

export default function DatePicker({
  //   selectedDate: initialDate,
  //   onChange,
  diary,
  onUpdate,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(diary.date_created) || null
  );
  const [viewDate, setViewDate] = useState<Date>(
    new Date(diary.date_created)|| new Date()
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (diary.date_created) {
      setSelectedDate(new Date(diary.date_created));
      setViewDate(new Date(diary.date_created));
    }
  }, [diary]);

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    console.log("old date: ", selectedDate)
    setSelectedDate(newDate);
    onUpdate({ ...diary, date_created: newDate, date_modified: new Date() });
    setIsOpen(false);
    console.log("new date: ", newDate)
    // if (onChange) {
    //   onChange(newDate);
    // }
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const toggleCalendar = () => setIsOpen(!isOpen);

  // Calendar Logic
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun

  // Adjust for Monday start (Mon=0, ..., Sun=6)
  const startDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const days = [];
  for (let i = 0; i < startDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="relative max-w-75" title="Date Created">
      <div
        className="flex justify-center items-center rounded-lg border text-(--text-color) px-3 py-2 shadow-sm cursor-pointer border-(--text-color)/50 hover:border-(--text-color) transition-colors"
        onClick={toggleCalendar}
      >
        <CalendarIcon size={18} className="mr-2" />
        <span className={``}>
          {selectedDate ? selectedDate.toLocaleDateString() : "Pick a date"}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-70 rounded-lg text-(--text-color) border border-(--text-color) backdrop-blur-2xl p-4 shadow-xl z-50 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-full hover:bg-(--text-color)/20 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-full hover:bg-(--text-color)/20 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2 text-center">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <span
                key={d}
                className="text-xs font-medium text-(--text-color)/50"
              >
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, i) => {
              if (!day) return <div key={i} />;
              const isSelected =
                selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <button
                  key={i}
                  onClick={() => handleDateClick(day)}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${
                      isSelected
                        ? "bg-(--text-color) text-white shadow-md"
                        : "text-(--text-color) hover:bg-(--text-color)/30"
                    }
                    ${
                      !isSelected && isToday
                        ? "border border-white text-white"
                        : ""
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
