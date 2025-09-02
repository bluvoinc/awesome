import React, { useState, useEffect } from 'react';

interface ExpiresInComponentProps {
  expiresAt: number;
  label?: string;
  onExpired?: () => void;
  size?: 'small' | 'normal' | 'large';
  showIcon?: boolean;
}

export function ExpiresInComponent({ 
  expiresAt, 
  label = "Expires in:",
  onExpired,
  size = 'normal',
  showIcon = true
}: ExpiresInComponentProps) {
  const [timeRemaining, setTimeRemaining] = useState(() => 
    Math.max(0, Math.round((expiresAt - Date.now()) / 1000))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
      setTimeRemaining(newTimeRemaining);
      
      // Call onExpired callback when timer reaches 0
      if (newTimeRemaining <= 0) {
        clearInterval(timer);
        if (onExpired) {
          onExpired();
        }
      }
    }, 1000);

    // Clear timer on component unmount
    return () => clearInterval(timer);
  }, [expiresAt, onExpired]);

  const isExpired = timeRemaining <= 0;
  const isCritical = timeRemaining < 10 && timeRemaining > 0;
  const isUrgent = timeRemaining < 30;
  const isWarning = timeRemaining < 60;

  // Size-based styling
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: isWarning ? '0.9em' : '0.8em',
          gap: '0.25rem'
        };
      case 'large':
        return {
          fontSize: isWarning ? '1.4em' : '1.2em',
          gap: '0.75rem'
        };
      default:
        return {
          fontSize: isWarning ? '1.2em' : '1em',
          gap: '0.5rem'
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <div style={{ 
        color: isExpired ? '#dc3545' : isUrgent ? '#ffc107' : '#6c757d',
        display: 'flex',
        alignItems: 'center',
        gap: sizeStyles.gap,
        fontSize: sizeStyles.fontSize
      }}>
        <strong>{label}</strong> 
        <span style={{
          fontWeight: 'bold',
          color: isExpired ? '#dc3545' : isUrgent ? '#dc3545' : isWarning ? '#ffc107' : '#28a745',
          transition: 'all 0.3s ease',
          animation: isCritical ? 'pulse 1s infinite' : 'none'
        }}>
          {isExpired 
            ? (showIcon ? '⏰ EXPIRED' : 'EXPIRED')
            : `${timeRemaining}s`
          }
        </span>
      </div>
    </>
  );
}