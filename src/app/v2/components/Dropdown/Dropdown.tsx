// src/app/v2/components/Dropdown/Dropdown.tsx

"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css';
import { IoChevronDown } from "react-icons/io5";


interface DropdownProps {
    value?: any;
    onChange?: (value: any) => void;
    options: Array<any>; // Allow any type for options to support templates
    optionLabel?: string; // Key for label in options objects
    optionValue?: string; // Key for value in options objects
    placeholder?: string;
    disabled?: boolean;
    variant?: 'filled' | 'outlined' | 'text';
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help';
    label?: string;
    error?: string;
    className?: string; // Classes for the container
    inputClassName?: string; // Classes for the input display
    panelClassName?: string; // Classes for the dropdown panel
    icon?: React.ReactNode; // Add icon prop
    iconPosition?: 'left' | 'right'; // Add iconPosition prop
    panelWidth?: 'auto' | 'w-full' | string; // Add panelWidth prop
    optionTemplate?: (option: any) => React.ReactNode; // Add optionTemplate prop
}

const Dropdown: React.FC<DropdownProps> = ({
    value,
    onChange,
    options,
    optionLabel = 'label',
    optionValue = 'value',
    placeholder,
    disabled,
    variant = 'filled',
    severity = 'primary',
    label,
    error,
    className,
    inputClassName,
    panelClassName,
    icon, // Added icon prop
    iconPosition = 'left', // Added iconPosition prop
    panelWidth = 'auto', // Added panelWidth prop
    optionTemplate, // Added optionTemplate prop
    ...props
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputClick = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleOptionSelect = (option: any) => {
        const selectedValue = optionValue && typeof option === 'object' ? option[optionValue] : option;
        if (onChange) {
            onChange(selectedValue);
        }
        setIsOpen(false)
    };

    // Get the label for an option
    const getOptionLabel = (option: any): string | number => {
        if (optionLabel && typeof option === 'object' && option[optionLabel] !== undefined) {
            return String(option[optionLabel]); // Explicitly convert to string
        }
        // If optionLabel not provided or option is not an object, assume the option itself is the label (should be primitive)
        return String(option); // Explicitly convert to string
    };

    // Get the value for an option
    const getOptionValue = (option: any): any => { // Keep as any as value can be string/number
        if (optionValue && typeof option === 'object' && option[optionValue] !== undefined) {
            return option[optionValue];
        }
        return option; // Assume option is the value if no optionValue is provided (should be primitive)
    }

    // Find the selected option object to display the label
    const selectedOption = options.find(option => getOptionValue(option) === value);
    // **ENSURE displayedValue is a string or number**
    const displayedValue = selectedOption ? getOptionLabel(selectedOption) : (placeholder || ''); // Default to empty string if no placeholder

    const isPlaceholder = !selectedOption && placeholder;

    // Determine if we need extra padding for icons
    const inputPaddingClass = icon
        ? (iconPosition === 'left' ? styles.inputWithLeftIcon : styles.inputWithRightIcon)
        : ''; // No padding needed if no icon


    // Determine panel width class
    const panelWidthClass = panelWidth === 'auto' ? 'w-full' : panelWidth; // 'w-full' if auto, otherwise the provided class


    const containerClasses = `${styles.dropdownContainer} ${className || ''}`;
    const inputClasses = `${styles.dropdownInput} ${styles[variant]} ${styles[severity]} ${disabled ? styles.disabled : ''} ${inputClassName || ''} ${isOpen ? styles.focused : ''} ${isPlaceholder ? styles.placeholder : ''} ${inputPaddingClass}`; // Add icon padding class
    const panelClasses = `${styles.dropdownPanel} ${panelClassName || ''} ${panelWidthClass}`; // Add panel width class

    return (
        <div className={containerClasses} ref={dropdownRef}>
            {label && <label className={styles.label}>{label}</label>}

            {/* Selected Value Display (Input-like area) */}
            <div
                className={inputClasses}
                onClick={handleInputClick}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleInputClick();
                    }
                }}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby={label ? `${label}-id` : undefined}
                ref={inputRef} // Attach ref to measure width for 'auto' panel width
            >
                {/* Primary Icon */}
                {icon && (
                    <div className={`${styles.icon} ${iconPosition === 'left' ? styles.iconLeft : styles.iconRight}`}>
                        {icon}
                    </div>
                )}
                <span>{displayedValue}</span>
                {/* Dropdown Arrow Icon */}
                <svg className={`${styles.dropdownArrow} w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>

            {/* Dropdown Options Panel */}
            {isOpen && (
                <ul className={panelClasses} role="listbox" aria-activedescendant="">
                    {options.map((option, index) => {
                        const optionValue = getOptionValue(option);
                        const optionLabel = getOptionLabel(option);

                        return (
                            <li
                                key={index}
                                className={`${styles.dropdownOption} ${value === optionValue ? styles.selected : ''}`}
                                onClick={() => handleOptionSelect(option)} // Pass the full option object
                                role="option"
                                aria-selected={value === optionValue}
                            >
                                {/* Render template or label */}
                                {optionTemplate ? optionTemplate(option) : optionLabel}
                            </li>
                        );
                    })}
                </ul>
            )}

            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
};

export default Dropdown;
