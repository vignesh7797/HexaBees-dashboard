// src/app/v2/components/Typography/Paragraph.tsx

import React from 'react';
import styles from './Typography.module.css';


interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
  color?: 'foreground' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help' | 'gray';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  size?: 'sm' | 'md' | 'lg';
}

const Paragraph: React.FC<ParagraphProps> = ({
  children,
  className,
  color = 'foreground', // Default text color
  weight, // Default weight will likely come from base styles or be standard
  size = 'md', // Default paragraph size
  ...props
}) => {
  const paragraphSizeClass = styles[`paragraph${size.charAt(0).toUpperCase() + size.slice(1)}`];
  const textColorClass = styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}`];
  const fontWeightClass = weight ? styles[`weight${weight.charAt(0).toUpperCase() + weight.slice(1)}`] : '';


  const classes = `${styles.baseText} ${paragraphSizeClass} ${textColorClass} ${fontWeightClass} ${className || ''}`;


  return (
    <p className={classes} {...props}>
      {children}
    </p>
  );
};

export default Paragraph;
