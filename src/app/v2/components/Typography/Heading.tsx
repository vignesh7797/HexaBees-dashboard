// src/app/v2/components/Typography/Heading.tsx

import React, { JSX } from 'react';
import styles from './Typography.module.css';


interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  color?: 'foreground' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help' | 'gray';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
}

const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  className,
  color = 'foreground', // Default text color
  weight, // Default weight will come from heading styles
  ...props
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements; // Dynamically determine the HTML tag

  const headingLevelClass = styles[`h${level}`];
  const textColorClass = styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}`]; // Convert color prop to class name
  const fontWeightClass = weight ? styles[`weight${weight.charAt(0).toUpperCase() + weight.slice(1)}`] : ''; // Apply weight class if provided


  const classes = `${styles.baseText} ${headingLevelClass} ${textColorClass} ${fontWeightClass} ${className || ''}`;


  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

export default Heading;
