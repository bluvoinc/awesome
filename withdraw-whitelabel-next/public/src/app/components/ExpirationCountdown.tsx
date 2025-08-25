import React, { useState, useEffect } from 'react';

interface ExpirationCountdownProps {
  expiresAt: string;
}

export function ExpirationCountdown({ expiresAt }: ExpirationCountdownProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  useEffect(() => {
    const calculateSecondsRemaining = () => {
      const expirationTime = new Date(expiresAt).getTime();
      const currentTime = Date.now();
      const remaining = Math.max(0, Math.floor((expirationTime - currentTime) / 1000));
      return Math.min(remaining, 60); // Cap at 60 seconds
    };

    setSecondsRemaining(calculateSecondsRemaining());

    const interval = setInterval(() => {
      const remaining = calculateSecondsRemaining();
      setSecondsRemaining(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return 'Expired';
    return `${seconds}s`;
  };

  const getColor = () => {
    if (secondsRemaining <= 0) return '#dc3545'; // Red for expired
    if (secondsRemaining <= 10) return '#fd7e14'; // Orange for warning
    return '#856404'; // Default color
  };

  return (
    <div style={{ marginBottom: "1rem", color: getColor() }}>
      <strong>Expires:</strong> {new Date(expiresAt).toLocaleTimeString()} ({formatTime(secondsRemaining)})
    </div>
  );
}