// src/app/v2/components/Card/Card.tsx

import React from 'react';
import styles from './Card.module.css';


interface CardProps {
  children: React.ReactNode;
  className?: string; // Classes for the container
  header?: React.ReactNode | string;
  title?: React.ReactNode; // Content for the title section
  footer?: React.ReactNode | string; // Content for the footer section
  padding?: 'sm' | 'md' | 'lg' | 'none'; // Padding control
  hasBorder?: boolean; // Add border
  hasShadow?: boolean; // Add shadow
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  header,
  title,
  footer,
  padding = 'md',
  hasBorder = false,
  hasShadow = true,
}) => {
  const contentPaddingClass = padding === 'none' ? '' : styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`];

  const cardClasses = `${styles.card} ${hasBorder ? styles.hasBorder : ''} ${hasShadow ? styles.hasShadow : ''} ${className || ''}`;
  // Padding class is now applied to inner sections, not the card container itself


  return (
    <div className={cardClasses}>
      {header && (
        <div className={styles.cardHeader}>
          {header}
        </div>
      )}

       {title && (
        // Apply padding to the title section if padding is not 'none'
        <div className={`${styles.cardTitle} ${contentPaddingClass}`}>
          {title}
        </div>
      )}

      {/* Apply padding to the main content area */}
      <div className={`${styles.cardContent} ${contentPaddingClass}`}>
        {children}
      </div>

      {footer && (
        // Apply padding to the footer section if padding is not 'none'
        <div className={`${styles.cardFooter} ${contentPaddingClass}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
