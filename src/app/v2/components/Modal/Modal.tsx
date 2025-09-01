
// src/app/v2/components/Modal/Modal.tsx

'use client';

import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import {
  FaTimes,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaQuestionCircle,
} from 'react-icons/fa';

// Define Severity type
type Severity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help';

interface ModalProps {
  visible: boolean;
  onHide: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string; // For the main panel
  maskClassName?: string; // For the backdrop
  closable?: boolean;
  closeOnMaskClick?: boolean;
  severity?: Severity;
  icon?: ReactNode;
}

// Map severities to default icons
const severityIcons: Record<Severity, ReactNode> = {
  primary: <FaInfoCircle />,
  secondary: <FaInfoCircle />,
  info: <FaInfoCircle />,
  success: <FaCheckCircle />,
  warning: <FaExclamationTriangle />,
  danger: <FaExclamationCircle />,
  help: <FaQuestionCircle />,
};

const Modal: React.FC<ModalProps> = ({
  visible,
  onHide,
  title,
  children,
  footer,
  className = '',
  maskClassName = '',
  closable = true,
  closeOnMaskClick = true,
  severity,
  icon,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closable) {
        onHide();
      }
    };
    if (visible) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [visible, closable, onHide]);

  const handleMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnMaskClick && e.target === e.currentTarget) {
      onHide();
    }
  };

  // Determine which icon to display
  const displayIcon = icon ? icon : severity ? severityIcons[severity] : null;

  // Determine icon class based on severity
  const iconSeverityClass = severity ? styles[`icon${severity.charAt(0).toUpperCase() + severity.slice(1)}`] : '';

  const modalContent = (
    <div className={`${styles.modalMask} ${maskClassName}`}>
      <div className={styles.modalWrapper} onClick={handleMaskClick}>
        <div ref={modalRef} className={`${styles.modalPanel} ${className}`}>
          {title && (
            <div className={styles.modalHeader}>
              <div className={styles.headerContent}>
                {displayIcon && (
                  <span className={`${styles.headerIcon} ${iconSeverityClass}`}>
                    {displayIcon}
                  </span>
                )}
                <h3 className={styles.modalTitle}>{title}</h3>
              </div>
              {closable && (
                <button onClick={onHide} className={styles.closeButton}>
                  <FaTimes />
                </button>
              )}
            </div>
          )}
          <div className={styles.modalContent}>{children}</div>
          {footer && <div className={styles.modalFooter}>{footer}</div>}
        </div>
      </div>
    </div>
  );

  if (isMounted && visible) {
    return createPortal(modalContent, document.body);
  }

  return null;
};

export default Modal;
