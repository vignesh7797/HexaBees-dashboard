// src/app/v2/components/Checkbox/Checkbox.tsx

"use client";

import React, { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';
import { IoCheckmarkSharp } from "react-icons/io5";


interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  labelPosition?: 'left' | 'right';
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help';
  error?: string;
  className?: string; // Classes for the container
  checkboxClassName?: string; // Classes for the custom checkbox element
  labelClassName?: string; // Classes for the label
  errorClassName?: string; // Classes for the error message
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  labelPosition = 'right',
  severity = 'primary',
  error,
  className,
  checkboxClassName,
  labelClassName,
  errorClassName,
  disabled,
  ...props // Capture other input props like 'name', 'value', etc.
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const containerClasses = `${styles.checkboxContainer} ${labelPosition === 'left' ? styles.labelLeft : ''} ${disabled ? styles.disabled : ''} ${className || ''}`;
  const customCheckboxClasses = `${styles.customCheckbox} ${styles[severity]} ${checkboxClassName || ''} ${error ? styles.error : ''}`; // Add error class here too
  const labelClasses = `${styles.label} ${labelClassName || ''}`;
  const errorMessageClasses = `${styles.errorMessage} ${errorClassName || ''}`;


  return (
    <div> {/* Wrapper for checkbox and potential error message */}
        <label className={containerClasses}>
          {/* Visually hidden native checkbox input */}
          <input
            type="checkbox"
            className={styles.nativeCheckbox}
            checked={checked}
            onChange={handleInputChange}
            disabled={disabled}
            {...props} // Pass other input props
          />

          {/* Custom styled checkbox element */}
          <div className={customCheckboxClasses}>
            {/* Checkmark Icon */}
            {checked && (
                <IoCheckmarkSharp className={styles.checkmark} /> // Use your checkmark icon component
            )}
          </div>

          {/* Label */}
          {label && <span className={labelClasses}>{label}</span>}
        </label>

        {/* Error message */}
        {error && <p className={errorMessageClasses}>{error}</p>}
    </div>
  );
};

export default Checkbox;
