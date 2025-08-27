// src/app/v2/components/RadioButton/RadioButton.tsx

"use client";

import React, { InputHTMLAttributes } from 'react';
import styles from './RadioButton.module.css';


interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  labelPosition?: 'left' | 'right';
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help';
  error?: string; // Less common for individual radio buttons
  name: string; // Required for grouping
  value: string | number; // Required for value

  className?: string; // Classes for the container
  radioClassName?: string; // Classes for the custom radio element
  labelClassName?: string; // Classes for the label
  errorClassName?: string; // Classes for the error message
}

const RadioButton: React.FC<RadioButtonProps> = ({
  checked,
  onChange,
  label,
  labelPosition = 'right',
  severity = 'primary',
  error,
  name, // Required
  value, // Required
  className,
  radioClassName,
  labelClassName,
  errorClassName,
  disabled,
  ...props // Capture other input props
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // For a radio button, onChange is typically called when it becomes checked
    onChange(event.target.checked);
  };

  const containerClasses = `${styles.radioContainer} ${labelPosition === 'left' ? styles.labelLeft : ''} ${disabled ? styles.disabled : ''} ${className || ''}`;
  const customRadioClasses = `${styles.customRadio} ${styles[severity]} ${radioClassName || ''} ${error ? styles.error : ''}`; // Add error class here too
  const labelClasses = `${styles.label} ${labelClassName || ''}`;
  const errorMessageClasses = `${styles.errorMessage} ${errorClassName || ''}`;


  return (
    <div> {/* Wrapper for radio button and potential error message */}
        <label className={containerClasses}>
          {/* Visually hidden native radio input */}
          <input
            type="radio"
            className={styles.nativeRadio}
            checked={checked}
            onChange={handleInputChange}
            disabled={disabled}
            name={name} // Pass name for grouping
            value={value} // Pass value
            {...props} // Pass other input props
          />

          {/* Custom styled radio button element (outer circle) */}
          <div className={customRadioClasses}>
            {/* Inner circle (appears when selected) */}
            {checked && (
                <div className={styles.innerCircle}></div>
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

export default RadioButton;
