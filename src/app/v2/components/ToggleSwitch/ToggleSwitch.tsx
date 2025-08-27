 // src/app/v2/components/ToggleSwitch/ToggleSwitch.tsx

"use client";

import React, { InputHTMLAttributes } from 'react';
import styles from './ToggleSwitch.module.css';


interface ToggleSwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  labelPosition?: 'left' | 'right';
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help';
  className?: string; // Classes for the container
  switchClassName?: string; // Classes for the custom switch element (track)
  thumbClassName?: string; // Classes for the thumb element
  labelClassName?: string; // Classes for the label
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  labelPosition = 'right',
  severity = 'primary',
  className,
  switchClassName,
  thumbClassName,
  labelClassName,
  disabled,
  ...props // Capture other input props
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const containerClasses = `${styles.switchContainer} ${labelPosition === 'left' ? styles.labelLeft : ''} ${disabled ? styles.disabled : ''} ${className || ''}`;
  const customSwitchClasses = `${styles.customSwitch} ${styles[severity]} ${switchClassName || ''}`;
  const switchThumbClasses = `${styles.switchThumb} ${thumbClassName || ''}`;
  const labelClasses = `${styles.label} ${labelClassName || ''}`;


  return (
    <label className={containerClasses}>
      {/* Visually hidden native checkbox input */}
      <input
        type="checkbox"
        className={styles.nativeCheckbox}
        checked={checked}
        onChange={handleInputChange}
        disabled={disabled}
        role="switch" // ARIA role for accessibility
        aria-checked={checked} // ARIA attribute for accessibility
        {...props} // Pass other input props
      />

      {/* Custom styled switch track */}
      <div className={customSwitchClasses}>
        {/* Switch thumb */}
        <div className={switchThumbClasses}></div>
      </div>

      {/* Label */}
      {label && <span className={labelClasses}>{label}</span>}
    </label>
  );
};

export default ToggleSwitch;
