import { describe, it, expect } from 'bun:test';
import { stats } from '@/functions/statsHandle';

// Test statistics functions
describe('Statistics Functions', () => {
  it('should return valid statistics structure', () => {
    const statistics = stats();

    expect(typeof statistics).toBe('object');
    expect(Array.isArray(statistics.daily)).toBe(true);
    expect(Array.isArray(statistics.weekly)).toBe(true);
    expect(Array.isArray(statistics.monthly)).toBe(true);
    expect(Array.isArray(statistics.yearly)).toBe(true);
    expect(typeof statistics.totalPomodoro).toBe('number');
    expect(typeof statistics.totalTime).toBe('number');
    expect(typeof statistics.consecutiveDays).toBe('number');
    expect(typeof statistics.completedTasksCount).toBe('number');
    expect(typeof statistics.quickNotes).toBe('number');
  });

  it('should have non-negative numeric values', () => {
    const statistics = stats();

    expect(statistics.totalPomodoro).toBeGreaterThanOrEqual(0);
    expect(statistics.totalTime).toBeGreaterThanOrEqual(0);
    expect(statistics.consecutiveDays).toBeGreaterThanOrEqual(0);
    expect(statistics.completedTasksCount).toBeGreaterThanOrEqual(0);
    expect(statistics.quickNotes).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty statistics gracefully', () => {
    // This tests the default behavior when localStorage is empty
    const statistics = stats();

    // Should not throw and should have default values
    expect(statistics).toBeDefined();
    expect(typeof statistics.totalPomodoro).toBe('number');
  });
});