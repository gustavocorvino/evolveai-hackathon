import { useState, useEffect } from 'react';

/**
 * Custom hook for countdown timer
 * @param {Date|Timestamp} startTime - Firestore timestamp when timer started
 * @param {number} durationMs - Duration in milliseconds (default 15 minutes)
 */
export function useCountdownTimer(startTime, durationMs = 15 * 60 * 1000) {
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  
  useEffect(() => {
    if (!startTime) {
      setRemainingSeconds(null);
      return;
    }
    
    const updateTimer = () => {
      const now = Date.now();
      const startMs = startTime.toMillis ? startTime.toMillis() : startTime.getTime();
      const elapsed = now - startMs;
      const remaining = Math.max(0, durationMs - elapsed);
      setRemainingSeconds(Math.floor(remaining / 1000));
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, durationMs]);
  
  const isExpired = remainingSeconds !== null && remainingSeconds <= 0;
  const isUrgent = remainingSeconds !== null && remainingSeconds < 60;
  const minutes = remainingSeconds ? Math.floor(remainingSeconds / 60) : 0;
  const seconds = remainingSeconds ? remainingSeconds % 60 : 0;
  
  return { 
    remainingSeconds, 
    isExpired, 
    isUrgent, 
    minutes, 
    seconds,
    formattedTime: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  };
}
