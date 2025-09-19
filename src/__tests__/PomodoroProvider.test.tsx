import { describe, it, expect } from 'bun:test';
import { classic, extended, short, balanced } from '@/components/PomodoroProvider';

// Test the timer configurations without React rendering
describe('Pomodoro Timer Configurations', () => {
  it('should have correct classic timer configuration', () => {
    expect(classic.timer).toBe(25);
    expect(classic.break).toBe(5);
    expect(classic.cycles).toBe(4);
    expect(classic.longBreak).toBe(30);
  });

  it('should have correct short timer configuration', () => {
    expect(short.timer).toBe(15);
    expect(short.break).toBe(3);
    expect(short.cycles).toBe(5);
    expect(short.longBreak).toBe(10);
  });

  it('should have correct balanced timer configuration', () => {
    expect(balanced.timer).toBe(30);
    expect(balanced.break).toBe(7);
    expect(balanced.cycles).toBe(4);
    expect(balanced.longBreak).toBe(20);
  });

  it('should have correct extended timer configuration', () => {
    expect(extended.timer).toBe(50);
    expect(extended.break).toBe(10);
    expect(extended.cycles).toBe(3);
    expect(extended.longBreak).toBe(20);
  });

  it('all timer configurations should have positive values', () => {
    const timers = [classic, short, balanced, extended];

    timers.forEach(timer => {
      expect(timer.timer).toBeGreaterThan(0);
      expect(timer.break).toBeGreaterThan(0);
      expect(timer.cycles).toBeGreaterThan(0);
      expect(timer.longBreak).toBeGreaterThan(0);
    });
  });

  it('should have reasonable time relationships', () => {
    const timers = [classic, short, balanced, extended];

    timers.forEach(timer => {
      // Long break should be longer than regular break
      expect(timer.longBreak).toBeGreaterThan(timer.break);
      // Timer should be longer than break
      expect(timer.timer).toBeGreaterThan(timer.break);
      // Should have at least 3 cycles
      expect(timer.cycles).toBeGreaterThanOrEqual(3);
    });
  });
});