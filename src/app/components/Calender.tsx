// components/CalendarPicker.tsx
import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/plugins/monthSelect/style.css';

interface CalendarPickerProps {
  popupPosition?: 'auto' | 'above' | 'below' | 'top' | 'bottom' | 'left' | 'right';
  minDate?: string | Date;
  maxDate?: string | Date;
  format?: string;
  value?: string | Date;
  onChange?: (selectedDates: Date[] | Date, dateStr: string) => void;
  range?: boolean;
  monthYearPicker?: boolean;
  onlyYearPicker?: boolean;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  popupPosition = 'auto',
  minDate,
  maxDate,
  format = 'Y-m-d',
  value,
  onChange,
  range = false,
  monthYearPicker = false,
  onlyYearPicker = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fp = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      if (fp.current) {
        fp.current.destroy();
      }

      // const plugins = [];

      // Month-Year Picker setup
    //   if (monthYearPicker) {
    //     plugins.push(
    //       monthSelectPlugin({
    //         dateFormat: format || 'm-Y',
    //         altFormat: 'F Y',
    //         theme: 'light',
    //       })
    //     );
    //   }

      fp.current = flatpickr(inputRef.current, {
        dateFormat: format,
        defaultDate: value,
        minDate,
        maxDate,
        mode: range ? 'range' : 'single',
        position: popupPosition,
        onChange,
        onReady: (selectedDates, dateStr, instance) => {
          // Hack to simulate year-only selection
          if (onlyYearPicker && instance.currentMonthElement) {
            instance.currentMonthElement.style.display = 'none';
            instance.calendarContainer.classList.add('only-year-picker');
          }
        },
      });
    }

    return () => {
      if (fp.current) {
        fp.current.destroy();
      }
    };
  }, [popupPosition, minDate, maxDate, format, value, range, monthYearPicker, onlyYearPicker]);

  return <input type="text" ref={inputRef} className="form-input px-3 py-2 rounded-md border w-full h-[38px] border-gray-300  focus:ring-gray-300 focus:border-gray-300" />;
};

export default CalendarPicker;
