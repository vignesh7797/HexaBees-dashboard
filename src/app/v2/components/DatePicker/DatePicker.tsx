// src/app/v2/components/DatePicker/DatePicker.tsx

"use client";

import React, { InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import Button from '../Button/Button'; 
import styles from './DatePicker.module.css';

// Import date-fns for date formatting
import { format, isDate } from 'date-fns';


// You will need to install and import your chosen DatePicker library here
// import ReactDatePicker from 'react-datepicker'; // Example import


interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: Date | undefined; // Updated value type for RDP
    onSelect: (date: Date | undefined) => void; // Handler using RDP types
    placeholder?: string;
    disabled?: boolean;
    className?: string; // Classes for the container
    inputClassName?: string; // Classes for the input element
    error?: string;
    format?: string; // Date format
    icon?: React.ReactNode; // Optional icon
    iconPosition?: 'left' | 'right'; // Icon position
    minDate?: Date | undefined; // Minimum selectable date
    maxDate?: Date | undefined; // Maximum selectable date
    isRange?: boolean; // Enable range selection
    showFooter?: boolean; // Show footer with Today/Clear
    monthOnly?: boolean; // Month and year selection only
    yearOnly?: boolean; // Year selection only
    useNativeMobile?: boolean; // Use native picker on mobile
    inline?: boolean; // Show calendar inline
    numberOfMonths?: number; // Number of months to display
    disabledDays?: Date[] ; // Disable specific days (Import DayMatcher if needed)
}

// Function to format date(s) for the input field
const formatSelectedDate = (value: Date | undefined, dateFormat: string): string => {
    if (!value) return '';
    if (isDate(value)) {
        return format(value, dateFormat);
    } else if (typeof value === 'object' && 'from' in value) {
        const fromDate = value.from ? format(value.from, dateFormat) : '';
        const toDate = value.to ? format(value.to, dateFormat) : '';
        return `${fromDate} - ${toDate}`;
    }
    return ''; // Fallback
};

const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onSelect,
    placeholder,
    disabled = false,
    className,
    inputClassName,
    error,
    format: dateFormat = 'dd/MM/yyyy',
    icon,
    iconPosition = 'right',
    minDate,
    maxDate,
    isRange = false,
    showFooter = false,
    monthOnly = false,
    yearOnly = false,
    useNativeMobile = true,
    inline = false,
    numberOfMonths = 1,
    disabledDays,
    ...props
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State to control popup visibility

    // Close calendar when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            // Check if the click was outside the input and the popup
            if (
                inputRef.current && !inputRef.current.contains(event.target as Node) &&
                popupRef.current && !popupRef.current.contains(event.target as Node)
            ) {
                setIsCalendarOpen(false);
            }
        };

        if (isCalendarOpen && !inline) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isCalendarOpen, inline]); // Re-run effect when isCalendarOpen or inline changes


    // Logic to handle native mobile date picker (conceptual - depends on library)
    // You might need to check user agent or screen size
    const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
    const shouldUseNative = useNativeMobile && isMobile && !isRange && !monthOnly && !yearOnly && !inline; // Native picker limitations


    // Determine input classes
    const inputClasses = `${styles.datePickerInput} ${icon ? (iconPosition === 'left' ? styles.withIconLeft : styles.withIconRight) : ''} ${error ? styles.error : ''} ${inputClassName || ''}`;


    // Handlers for DayPicker selection
    const handleDaySelect = (date: Date | undefined) => {
        onSelect(date);
        if (!isRange && !inline) { // Close popup after selecting a single date (if not inline)
            setIsCalendarOpen(false);
        }
    };


    // Handlers for footer buttons
    const handleTodayClick = () => {
        const today = new Date();
        if (onSelect) {
            if (isRange) {
                // Handle setting today for range - might set both from and to to today, or just from
                onSelect({ from: today, to: today }); // Example: set range to today
            } else {
                onSelect(today);
            }
        }
        if (!inline) setIsCalendarOpen(false); // Close popup
    };

    const handleClearClick = () => {
        if (onSelect) {
            onSelect(isRange ? { from: undefined, to: undefined } : undefined); // Clear based on isRange
        }
        if (!inline) setIsCalendarOpen(false); // Close popup
    };

    // Determine DayPicker mode and options
    let mode: "single" | "range" | undefined = isRange ? "range" : "single";
    let captionLayout: "dropdown" | "buttons" | undefined = undefined;
    let fromYear: number | undefined = undefined;
    let toYear: number | undefined = undefined;

    if (monthOnly) {
        mode = "single"; // Still single mode
        captionLayout = "dropdown"; // Show month/year dropdowns
    }

    if (yearOnly) {
        mode = "single"; // Still single mode
        captionLayout = "dropdown"; // Show month/year dropdowns
        fromYear = minDate?.getFullYear(); // Set year range for year-only
        toYear = maxDate?.getFullYear();
    }



    const datePopup = useRef<HTMLDivElement>(null);
    const [isOpenPopup, setIsOpenPopup] = useState(false);

    const handleOpenPopup = () => {
        setIsOpenPopup(true);
    }

    const handleClosePopup = () => {
        setIsOpenPopup(false);
    }

    return (
        // <div className={`${styles.datePickerContainer} ${className || ''}`}>
        //     {!inline && !shouldUseNative && ( // Render input for popup calendar (when not inline or native)
        //         <div className={styles.inputWrapper} onClick={() => !disabled && setIsCalendarOpen(!isCalendarOpen)}> {/* Toggle calendar visibility */}
        //             {icon && (
        //                 <span className={`${styles.icon} ${styles[iconPosition]}`}>
        //                     {icon}
        //                 </span>
        //             )}
        //             <input
        //                 type="text"
        //                 ref={inputRef}
        //                 className={inputClasses}
        //                 disabled={disabled}
        //                 placeholder={placeholder}
        //                 value={formatSelectedDate(value, dateFormat)} // Display formatted date(s)
        //                 readOnly // Prevent manual input
        //                 {...props}
        //             />
        //         </div>
        //     )}

        //     {shouldUseNative && ( // Render native input for mobile
        //         <input
        //             type="date" // Use type="date" for native picker
        //             className={inputClasses}
        //             // Format value for native input (YYYY-MM-DD)
        //             value={value instanceof Date ? format(value, 'yyyy-MM-dd') : ''}
        //             onChange={(e) => {
        //                 const date = e.target.value ? new Date(e.target.value) : undefined;
        //                 if (onSelect) onSelect(date);
        //             }}
        //             disabled={disabled}
        //             placeholder={placeholder}
        //             // Format min/max for native input (YYYY-MM-DD)
        //             min={minDate instanceof Date ? format(minDate, 'yyyy-MM-dd') : undefined}
        //             max={maxDate instanceof Date ? format(maxDate, 'yyyy-MM-dd') : undefined}
        //             {...props}
        //         />
        //     )}


        //     {(inline || isCalendarOpen) && !shouldUseNative && ( // Render DayPicker calendar (inline or popup, not native)
        //         <div ref={popupRef} className={inline ? styles.inlineCalendarContainer : ''}> {/* Apply inline container styles if inline */}
                    
                    

        //             {showFooter && !inline && !shouldUseNative && ( // Show footer only for popup, not inline or native
        //                 <div className={styles.datePickerFooter}>
        //                     <Button size="sm" variant="outlined" onClick={handleClearClick}>Clear</Button>
        //                     <Button size="sm" onClick={handleTodayClick}>Today</Button>
        //                 </div>
        //             )}

        //         </div>
        //     )}


        //     {error && (
        //         <p className={styles.errorMessage}>
        //             {error}
        //         </p>
        //     )}

        // </div>

        // <input type="date" name="date" id="" className='px-3 py-2 block w-full border rounded-md shadow-sm bg-background text-foreground placeholder-gray-400 focus:outline-none transition-colors duration-200 ease-in-otu' />

        <div className='block w-full relative'>
            <input type="text" className={styles.input} onFocus={handleOpenPopup} onBlur={handleClosePopup} />
            {
                isOpenPopup && (
                    <div className='absolute p-3 rounded-md shadow-md bg-background w-full min-h-[5rem] z-10' ref={datePopup}></div>
                )
            }
        </div>
    );
};

export default DatePicker;
