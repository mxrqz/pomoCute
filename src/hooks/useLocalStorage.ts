"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';
import type { Statistics } from '@/types/types';

type SetValue<T> = T | ((prevValue: T) => T);

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: { debounceMs?: number; throttleMs?: number } = {}
): [T, (value: SetValue<T>) => void, boolean] {
  const { debounceMs = 500, throttleMs } = options;
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const pendingValueRef = useRef<T | null>(null);

  // Initialize value from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          const parsedValue = JSON.parse(item);
          setStoredValue(parsedValue);
        } else {
          // Set initial value if key doesn't exist
          window.localStorage.setItem(key, JSON.stringify(initialValue));
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    } finally {
      setIsLoading(false);
    }
  }, [key, initialValue]);

  // Debounced function to write to localStorage
  const writeToStorage = useCallback((value: T) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key]);

  const debouncedWrite = useDebounce(writeToStorage, debounceMs);

  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Update state immediately for UI responsiveness
        setStoredValue(valueToStore);
        pendingValueRef.current = valueToStore;

        // Write to localStorage with debounce to avoid excessive writes
        if (throttleMs) {
          // If throttling is enabled, write immediately but throttled
          writeToStorage(valueToStore);
        } else {
          // Otherwise use debounce
          debouncedWrite(valueToStore);
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [storedValue, debouncedWrite, writeToStorage, throttleMs, key]
  );

  // Ensure final write on unmount if there's a pending value
  useEffect(() => {
    return () => {
      if (pendingValueRef.current !== null) {
        writeToStorage(pendingValueRef.current);
      }
    };
  }, [writeToStorage]);

  return [storedValue, setValue, isLoading];
}

// Specialized hook for statistics with faster debounce for frequent updates
export function useStatistics() {
  return useLocalStorage<Statistics>('pomodoroStats', {
    daily: [],
    weekly: [],
    monthly: [],
    yearly: [],
    totalPomodoro: 0,
    totalTime: 0,
    consecutiveDays: 0,
    completedTasksCount: 0,
    quickNotes: 0,
    musicListeningDuration: 0
  }, { debounceMs: 1000 }); // 1 second debounce for stats
}

// Hook for tasks with shorter debounce since they're user-edited
export function useTasks() {
  return useLocalStorage('pomodoroTasks', [], { debounceMs: 300 });
}

// Hook for notes with shorter debounce
export function useNotes() {
  return useLocalStorage('pomodoroNotes', [], { debounceMs: 500 });
}