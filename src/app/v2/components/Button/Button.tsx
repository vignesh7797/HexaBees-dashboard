// src/app/v2/components/Button/Button.tsx

"use client";

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'raised';
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help';
  size?: 'sm' | 'md' | 'lg';
  isRounded?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  severity = 'primary',
  size = 'md',
  isRounded = false,
  icon,
  iconPosition = 'left',
  children,
  className,
  ...props
}) => {
  const buttonClasses = `${styles.button} ${styles[severity]} ${styles[variant]} ${styles[size]} ${isRounded ? styles.rounded : ''} ${icon && !children ? styles.iconOnly : ''} ${icon && children ? (iconPosition === 'right' ? styles.iconLeft : styles.iconRight) : ''} ${className || ''}`;

  return (
    <button className={buttonClasses} {...props}>
      {icon && <span>{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button;
