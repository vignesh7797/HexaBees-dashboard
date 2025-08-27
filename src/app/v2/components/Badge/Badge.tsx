// src/app/v2/components/Badge/Badge.tsx

import React from 'react';
import styles from './Badge.module.css';


interface BadgeProps {
  children?: React.ReactNode;
  className?: string; // Classes for the container
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help';
  variant?: 'filled' | 'outlined' | 'text';
  isRounded?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  severity = 'primary',
  variant = 'filled',
  isRounded = false,
  icon,
  iconPosition = 'left',
}) => {
  const badgeClasses = `${styles.badge} ${styles[severity]} ${styles[variant]} ${isRounded ? styles.rounded : ''} ${icon && children ? (iconPosition === 'right' ? styles.iconLeft : styles.iconRight) : ''} ${className || ''}`;


  return (
    <span className={badgeClasses}>
      {icon && <span>{icon}</span>}
      {children && <span>{children}</span>}
    </span>
  );
};

export default Badge;
