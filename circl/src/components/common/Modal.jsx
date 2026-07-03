import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md', showClose = true }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />

      {/* Modal Content */}
      <div
        className={`
          relative w-full ${sizeClasses[size]}
          bg-card rounded-t-2xl sm:rounded-2xl
          shadow-modal animate-slide-up
          max-h-[90vh] overflow-y-auto
        `}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="sticky top-0 bg-card z-10 flex items-center justify-between p-md border-b border-outline-variant/20 rounded-t-2xl">
            <h2 className="text-headline-sm font-semibold text-on-surface">{title}</h2>
            {showClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-surface-container transition-colors"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-md">{children}</div>

        {/* Handle bar for mobile */}
        <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2">
          <div className="w-10 h-1 bg-outline-variant/50 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Modal;
