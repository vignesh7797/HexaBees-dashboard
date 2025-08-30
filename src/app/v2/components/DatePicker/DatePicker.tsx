// src/app/v2/components/DatePicker/DatePicker.tsx

"use client";

import dayjs, { Dayjs } from "dayjs";
import { useEffect, useRef, useState } from "react";
import Calendar from "../Calendar/Calendar";
import InputField from "../InputField/InputField";
import { FaRegCalendar } from "react-icons/fa6";


interface DatePickerProps {
    value?: Dayjs | null;
    onChange?: (date: Dayjs | null) => void;
    placeholder?: string;
    minDate?: Dayjs;
    maxDate?: Dayjs;
    format?: string;
}

function DatePicker({
    value,
    onChange,
    placeholder = "Select date",
    minDate,
    maxDate,
    format = "YYYY-MM-DD",
}: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<Dayjs>(value ? dayjs(value) : null);
    const [isMobile, setIsMobile] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Detect screen size (simple approach)
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Sync external value
    useEffect(() => {
        if (value) {
            setInternalValue(dayjs(value));
        } else {
            setInternalValue(null);
        }
    }, [value]);

    // Handle outside click
    useEffect(() => {
        if (isMobile) return; // skip for mobile bottom sheet
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobile]);

    const handleSelect = (date: Dayjs | null) => {
        const normalized = date ? dayjs(date) : null;
        setInternalValue(normalized);
        onChange?.(normalized);
        setOpen(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            {/* Input Field */}
            <InputField
                type="text"
                readOnly
                placeholder={placeholder}
                value={internalValue ? internalValue.format(format) : ""}
                onFocus={() => setOpen(true)}
                onClick={() => setOpen(true)}
                icon={<FaRegCalendar />}
                iconPosition="right"
            />

            {/* Popup Calendar */}
            {!isMobile && open && (
                <div className="absolute z-50 mt-2">
                    <Calendar
                        minDate={minDate}
                        maxDate={maxDate}
                        defaultValue={internalValue || undefined}
                        format={format}
                        onSelect={handleSelect}
                    />
                </div>
            )}

            {/* Bottom Sheet Calendar (Mobile) */}
            {isMobile && open && (
                <div className="fixed inset-x-0 bottom-0 z-50 bg-white shadow-2xl rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-lg">Select Date</span>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>
                    </div>
                    <Calendar
                        minDate={minDate}
                        maxDate={maxDate}
                        defaultValue={internalValue || undefined}
                        format={format}
                        onSelect={handleSelect}
                    />
                </div>
            )}
        </div>
    );
}

export default DatePicker;
