import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for managing session timer
 */
export function useTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      setIsRunning(true);
      setIsPaused(false);
    } else if (isPaused) {
      // Resume from pause
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      setIsPaused(false);
    }
  }, [isRunning, isPaused]);

  const pause = useCallback(() => {
    if (isRunning && !isPaused) {
      pausedTimeRef.current = elapsedTime;
      setIsPaused(true);
    }
  }, [isRunning, isPaused, elapsedTime]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    pausedTimeRef.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setElapsedTime(0);
    pausedTimeRef.current = 0;
    startTimeRef.current = null;
  }, [stop]);

  const getElapsedTime = useCallback(() => {
    return elapsedTime;
  }, [elapsedTime]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  return {
    isRunning,
    isPaused,
    elapsedTime,
    start,
    pause,
    stop,
    reset,
    getElapsedTime
  };
}
