'use client'
import { FC, useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Mode = 'day' | 'year' | 'month' | 'range';

interface CustomDatePickerProps {
  mode?: Mode;
  value?: Date | [Date | null, Date | null] | null;
  onChange?: (value: Date | [Date | null, Date | null] | null) => void;
}

export const DatePicker:FC<CustomDatePickerProps> = ({ mode = 'day', value = null, onChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Initialize default values on mount
  useEffect(() => {
    if (mode === 'range' && Array.isArray(value)) {
      setStartDate(value[0]);
      setEndDate(value[1]);
    } else if (
      (mode === 'day' || mode === 'year' || mode === 'month') &&
      value instanceof Date
    ) {
      setStartDate(value);
    }
  }, [value, mode]);

  const handleChange = (date) => {
    if (mode === 'range') {
      setStartDate(date[0]);
      setEndDate(date[1]);
      onChange?.(date);
    } else {
      setStartDate(date);
      onChange?.(date);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {mode === 'year' && (
        <ReactDatePicker
          selected={startDate}
          onChange={handleChange}
          showYearPicker
          dateFormat="yyyy"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-800"
          placeholderText="Select year"
          minDate={new Date('2025-03-01')}
          maxDate={new Date()}
        />
      )}

      {mode === 'month' && (
        <ReactDatePicker
          selected={startDate}
          onChange={handleChange}
          showMonthYearPicker
          dateFormat="MM/yyyy"
          className="w-full px-4 py-2 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-800"
          placeholderText="Select month and year"
          minDate={new Date('2025-03-01')}
          maxDate={new Date()}
        />
      )}

      {mode === 'range' && (
        <ReactDatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={handleChange}
          dateFormat="dd/MM/yyyy"
          className="w-full px-4 py-2 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-800"
          placeholderText="Select date range"
          minDate={new Date('2025-03-01')}
          maxDate={new Date()}
        />
      )}

      {mode === 'day' && (
        <ReactDatePicker
          selected={startDate}
          onChange={handleChange}
          dateFormat="dd/MM/yyyy"
          className="w-full px-4 py-2 border border-gray-300  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-gray-800"
          placeholderText="Select date"
          minDate={new Date('2025-03-01')}
          maxDate={new Date()}
        />
      )}
    </div>
  );
}