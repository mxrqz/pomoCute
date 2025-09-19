"use client"

import { useEffect, useState } from 'react';
import { useStatistics } from './useLocalStorage';
import type { PomodoroData } from '@/types/types';
import { format, isThisWeek, isThisMonth, differenceInMinutes } from 'date-fns';

export interface AnalyticsData {
  focusTime: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  productivity: {
    averageSessionLength: number;
    completionRate: number;
    bestTimeOfDay: string;
    currentStreak: number;
    longestStreak: number;
  };
  patterns: {
    dailyAverage: number;
    weeklyTrend: 'increasing' | 'decreasing' | 'stable';
    mostActiveDay: string;
    leastActiveDay: string;
  };
  insights: string[];
}

export function useAnalytics(): AnalyticsData {
  const [statistics] = useStatistics();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    focusTime: { today: 0, thisWeek: 0, thisMonth: 0, total: 0 },
    productivity: { averageSessionLength: 0, completionRate: 0, bestTimeOfDay: '09:00', currentStreak: 0, longestStreak: 0 },
    patterns: { dailyAverage: 0, weeklyTrend: 'stable', mostActiveDay: 'Segunda', leastActiveDay: 'Domingo' },
    insights: []
  });

  useEffect(() => {
    if (!statistics) return;

    // Focus time calculations
    const today = format(new Date(), 'MM/dd/yyyy');
    const todayStats = statistics.daily.find(day => day.date === today);
    const todayFocusTime = todayStats?.totalTime || 0;

    const thisWeekFocusTime = statistics.daily
      .filter(day => {
        try {
          const date = new Date(day.date);
          return isThisWeek(date);
        } catch {
          return false;
        }
      })
      .reduce((total, day) => total + (day.totalTime || 0), 0);

    const thisMonthFocusTime = statistics.monthly
      .filter(month => {
        try {
          const date = new Date(month.date);
          return isThisMonth(date);
        } catch {
          return false;
        }
      })
      .reduce((total, month) => total + (month.totalTime || 0), 0);

    // Productivity calculations
    const totalSessions = statistics.totalPomodoro;
    const totalFocusTime = statistics.totalTime;
    const averageSessionLength = totalSessions > 0 ? Math.round(totalFocusTime / totalSessions) : 0;

    // Completion rate (assuming 25min standard pomodoro)
    const expectedTime = totalSessions * 25;
    const completionRate = expectedTime > 0 ? Math.round((totalFocusTime / expectedTime) * 100) : 0;

    // Best time of day from monthly data
    const allTimes = statistics.monthly.flatMap(month => month.times || []);
    const bestTimeOfDay = getBestTimeOfDay(allTimes);

    // Streak calculation
    const currentStreak = calculateCurrentStreak(statistics.daily);
    const longestStreak = calculateLongestStreak(statistics.daily);

    // Weekly trend
    const weeklyTrend = calculateWeeklyTrend(statistics.weekly);

    // Day of week analysis
    const { mostActiveDay, leastActiveDay } = analyzeDaysOfWeek(statistics.daily);

    // Daily average
    const activeDays = statistics.daily.filter(day => day.totalTime > 0).length;
    const dailyAverage = activeDays > 0 ? Math.round(totalFocusTime / activeDays) : 0;

    // Generate insights
    const insights = generateInsights({
      todayFocusTime,
      averageSessionLength,
      completionRate,
      currentStreak,
      totalSessions,
      bestTimeOfDay,
      mostActiveDay
    });

    setAnalytics({
      focusTime: {
        today: todayFocusTime,
        thisWeek: thisWeekFocusTime,
        thisMonth: thisMonthFocusTime,
        total: totalFocusTime
      },
      productivity: {
        averageSessionLength,
        completionRate,
        bestTimeOfDay,
        currentStreak,
        longestStreak
      },
      patterns: {
        dailyAverage,
        weeklyTrend,
        mostActiveDay,
        leastActiveDay
      },
      insights
    });
  }, [statistics]);

  return analytics;
}

function getBestTimeOfDay(times: string[]): string {
  if (times.length === 0) return '09:00';

  const hourCounts: { [key: string]: number } = {};

  times.forEach(time => {
    const hour = time.split(':')[0].padStart(2, '0');
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const bestHour = Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || '09';

  return `${bestHour}:00`;
}

function calculateCurrentStreak(dailyStats: PomodoroData[]): number {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i <= 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = format(checkDate, 'MM/dd/yyyy');

    const dayStats = dailyStats.find(day => day.date === dateStr);
    if (dayStats && dayStats.totalTime > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak(dailyStats: PomodoroData[]): number {
  let longestStreak = 0;
  let currentStreak = 0;

  // Sort by date
  const sortedStats = dailyStats
    .filter(day => day.totalTime > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (let i = 0; i < sortedStats.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const prevDate = new Date(sortedStats[i - 1].date);
      const currentDate = new Date(sortedStats[i].date);
      const daysDiff = differenceInMinutes(currentDate, prevDate) / (24 * 60);

      if (daysDiff === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
  }

  return Math.max(longestStreak, currentStreak);
}

function calculateWeeklyTrend(weeklyStats: PomodoroData[]): 'increasing' | 'decreasing' | 'stable' {
  if (weeklyStats.length < 2) return 'stable';

  const recent = weeklyStats.slice(-2);
  const [prev, current] = recent;

  const difference = current.totalTime - prev.totalTime;
  const threshold = prev.totalTime * 0.1; // 10% threshold

  if (difference > threshold) return 'increasing';
  if (difference < -threshold) return 'decreasing';
  return 'stable';
}

function analyzeDaysOfWeek(dailyStats: PomodoroData[]): { mostActiveDay: string; leastActiveDay: string } {
  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const dayTotals = new Array(7).fill(0);

  dailyStats.forEach(day => {
    try {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      dayTotals[dayOfWeek] += day.totalTime || 0;
    } catch {
      // Invalid date, skip
    }
  });

  const maxIndex = dayTotals.indexOf(Math.max(...dayTotals));
  const minIndex = dayTotals.indexOf(Math.min(...dayTotals));

  return {
    mostActiveDay: dayNames[maxIndex],
    leastActiveDay: dayNames[minIndex]
  };
}

function generateInsights(data: {
  todayFocusTime: number;
  averageSessionLength: number;
  completionRate: number;
  currentStreak: number;
  totalSessions: number;
  bestTimeOfDay: string;
  mostActiveDay: string;
}): string[] {
  const insights: string[] = [];

  if (data.currentStreak >= 7) {
    insights.push(`🔥 Parabéns! Você está numa sequência de ${data.currentStreak} dias!`);
  }

  if (data.completionRate >= 90) {
    insights.push(`⭐ Excelente consistência! ${data.completionRate}% de conclusão das sessões.`);
  } else if (data.completionRate < 70) {
    insights.push(`💡 Tente sessões mais curtas para melhorar sua taxa de conclusão.`);
  }

  if (data.averageSessionLength > 30) {
    insights.push(`🎯 Suas sessões longas mostram excelente concentração!`);
  }

  insights.push(`⏰ Seu horário mais produtivo é ${data.bestTimeOfDay}.`);

  if (data.totalSessions >= 100) {
    insights.push(`🏆 Impressionante! Você já completou ${data.totalSessions} pomodoros.`);
  }

  insights.push(`📊 Você é mais produtivo nas ${data.mostActiveDay}s.`);

  if (data.todayFocusTime === 0) {
    insights.push(`🌟 Que tal começar com uma sessão de foco hoje?`);
  } else if (data.todayFocusTime >= 120) {
    insights.push(`🎉 Ótimo dia de foco! Você já focou ${data.todayFocusTime} minutos hoje.`);
  }

  return insights;
}