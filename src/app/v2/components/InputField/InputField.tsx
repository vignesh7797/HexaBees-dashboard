// src/app/v2/components/InputField/InputField.tsx

"use client";

import React, { useState, useRef } from 'react'; // Import useState, useRef
import styles from './InputField.module.css';
import { IoClose, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";



interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  showClear?: boolean;
  containerClassName?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  showClear = false,
  className,
  containerClassName,
  type = 'text', // Default type
  value,
  onChange,
  ...props
}) => {
  // State to manage password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input element

  // Determine the actual input type (text or password based on toggle)
  const actualInputType = type === 'password' && isPasswordVisible ? 'text' : type;

  // Handle clearing the input value
  const handleClear = () => {
      if (inputRef.current) {
          inputRef.current.value = ''; // Clear the input value directly
          // If you're using controlled components (value and onChange props),
          // you'll need to call the onChange handler with an empty value
           if (onChange) {
               onChange({
                   target: { value: '' },
                   // Mimic a ChangeEvent
                   currentTarget: inputRef.current,
                   bubbles: true,
                   cancelable: true,
                   defaultPrevented: false,
                   eventPhase: 3, // BUBBLING_PHASE
                   isTrusted: true,
                   nativeEvent: new Event('change', { bubbles: true, cancelable: true }),
                   persist: () => {},
                   timeStamp: Date.now(),
                  type: 'change',
              } as React.ChangeEvent<HTMLInputElement>);
           }
      }
  };

  // Determine if we need extra padding for icons
  const inputPaddingClass = icon
    ? (iconPosition === 'left' ? styles.inputWithLeftIcon : styles.inputWithRightIcon)
    : (showClear && type !== 'password') // Only add padding for clear icon if no other icon on right
      ? styles.inputWithRightIcon
      : (type === 'password' && !showClear) // Only add padding for password toggle if no other icon on right
         ? styles.inputWithRightIcon
         : (showClear && type === 'password') // If both clear and password toggle are present
            ? styles.inputWithRightIcon // Adjust padding based on both icons on right
            : '';

  // Adjust padding for clear icon and password toggle when both are present
  const combinedRightIcons = (showClear && type === 'password') || (showClear && icon && iconPosition === 'right') || (type === 'password' && icon && iconPosition === 'right');
   const inputPaddingForCombinedRightIcons = combinedRightIcons ? styles.inputWithRightIcon : ''; // You might need more specific padding if multiple icons on right


  const inputClasses = `${styles.input} ${error ? styles.error : ''} ${inputPaddingClass} ${inputPaddingForCombinedRightIcons} ${className || ''}`;
  const containerClasses = `${styles.inputWrapper} ${containerClassName || ''}`;

  return (
    <div className={containerClasses}>
      {label && <label className={styles.label}>{label}</label>}

      <div className="relative"> {/* Inner wrapper for icons */}
         {/* Primary Icon */}
         {icon && (
             <div className={`${styles.icon} ${iconPosition === 'left' ? styles.iconLeft : styles.iconRight}`}>
                 {icon}
             </div>
         )}

         {/* Input Element */}
         <input
           ref={inputRef} // Attach ref
           type={actualInputType}
           className={inputClasses}
           value={value} // Bind value for controlled components
           onChange={onChange} // Bind onChange
           {...props}
         />

         {/* Clear Icon */}
         {showClear && value && ( // Show clear icon only if showClear is true and input has a value
             <div className={styles.clearIcon} onClick={handleClear}>
                {/* Replace with your clear icon (e.g., an X) */}
                 {<IoClose />}
             </div>
         )}

         {/* Password Toggle Icon */}
         {type === 'password' && ( // Show password toggle only for password type
             <div
                 className={`${styles.passwordToggleIcon} ${showClear ? 'right-8' : ''}`} // Adjust right position if clear icon is also present
                 onClick={() => setIsPasswordVisible(!isPasswordVisible)}
             >
                 {/* Replace with your eye/eye-slash icons */}
                 {isPasswordVisible ? (
                     <IoEyeOffOutline/>
                 ) : (
                     <IoEyeOutline/>
                 )}
             </div>
         )}
      </div>


      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default InputField;
