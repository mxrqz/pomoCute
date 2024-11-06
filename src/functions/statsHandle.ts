import type { Statistics } from "@/types/types";

import { format } from 'date-fns'

const initialStatistics: Statistics = {
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
};

function stats() {
    if (typeof window !== "undefined") {
        const stats = localStorage.getItem('pomodoroStats');
        if (stats) {
            const statsParsed: Statistics = JSON.parse(stats);
            return statsParsed;
        } else {
            localStorage.setItem('pomodoroStats', JSON.stringify(initialStatistics))
        }
    }
    return initialStatistics;
};

function updateDailyPomodoros(statistics: Statistics) {
    const today = format(new Date(), 'MM/dd/yyyy');
    const existingDay = statistics.daily.find(day => day.date === today);

    if (existingDay) {
        existingDay.pomodoros += 1;
        
    } else {
        if (statistics.daily.length >= 7) {
            statistics.daily.shift();
        }

        statistics.daily.push({ date: today, pomodoros: 1, totalTime: 0 });
    }
}

function updateWeeklyPomodoros(statistics: Statistics) {
    const currentWeek = format(new Date(), 'ww/yyyy');
    const existingWeek = statistics.weekly.find(week => week.date === currentWeek);

    if (existingWeek) {
        existingWeek.pomodoros += 1;
    } else {
        if (statistics.weekly.length >= 7) {
            statistics.weekly.shift();
        }
        statistics.weekly.push({ date: currentWeek, pomodoros: 1, totalTime: 0 });
    }
}

function updateMonthlyPomodoros(statistics: Statistics) {
    const currentMonth = format(new Date(), 'MMM/yyyy');
    const existingMonth = statistics.monthly.find(month => month.date === currentMonth);
    const currentTime = format(new Date(), 'H:mm')

    if (existingMonth) {
        existingMonth.pomodoros += 1;
        existingMonth.times.push(currentTime)
    } else {
        if (statistics.monthly.length >= 12) {
            statistics.monthly.shift();
        }
        statistics.monthly.push({ date: currentMonth, times: [currentTime], pomodoros: 1, totalTime: 0 });
    }
}

function updateAnnualPomodoros(statistics: Statistics) {
    const currentYear = format(new Date(), 'yyyy');
    const existingYear = statistics.yearly.find(year => year.date === currentYear);

    if (existingYear) {
        existingYear.pomodoros += 1;
    } else {
        if (statistics.yearly.length >= 5) {
            statistics.yearly.shift();
        }
        statistics.yearly.push({ date: currentYear, pomodoros: 1, totalTime: 0 });
    }
}

function updateCompletedTasksCount() {
    const statistics: Statistics = stats()
    const updatedStats: Statistics = { ...statistics, completedTasksCount: statistics.completedTasksCount + 1 };
    localStorage.setItem('pomodoroStats', JSON.stringify(updatedStats));
}

function updateQuickNotesCount() {
    const statistics: Statistics = stats()
    const updatedStats: Statistics = { ...statistics, quickNotes: statistics.quickNotes + 1 };
    localStorage.setItem('pomodoroStats', JSON.stringify(updatedStats));
}

function updatePomodoroCount() {
    const statistics: Statistics = stats()
    updateDailyPomodoros(statistics);
    updateWeeklyPomodoros(statistics);
    updateMonthlyPomodoros(statistics);
    updateAnnualPomodoros(statistics);
    statistics.totalPomodoro = statistics.totalPomodoro + 1
    localStorage.setItem('pomodoroStats', JSON.stringify(statistics))
}

function updateDailyPomodoroTime(statistics: Statistics, timer: number) {
    const today = format(new Date(), 'MM/dd/yyyy');
    const existingDay = statistics.daily.find(day => day.date === today);

    if (existingDay) {
        existingDay.totalTime += timer;
    } else {
        if (statistics.daily.length >= 7) {
            statistics.daily.shift();
        }
        statistics.daily.push({ date: today, pomodoros: 0, totalTime: timer });
    }
}

function updateWeeklyPomodoroTime(statistics: Statistics, timer: number) {
    const currentWeek = format(new Date(), 'ww/yyyy');
    const existingWeek = statistics.weekly.find(week => week.date === currentWeek);

    if (existingWeek) {
        existingWeek.totalTime += timer;
    } else {
        if (statistics.weekly.length >= 7) {
            statistics.weekly.shift();
        }
        statistics.weekly.push({ date: currentWeek, pomodoros: 0, totalTime: timer });
    }
}

function updateMonthlyPomodoroTime(statistics: Statistics, timer: number) {
    const currentMonth = format(new Date(), 'MMM/yyyy');
    const existingMonth = statistics.monthly.find(month => month.date === currentMonth);

    if (existingMonth) {
        existingMonth.totalTime += timer;
    } else {
        if (statistics.monthly.length >= 12) {
            statistics.monthly.shift();
        }
        statistics.monthly.push({ date: currentMonth, times: [], pomodoros: 0, totalTime: timer });
    }
}

function updateAnnualPomodoroTime(statistics: Statistics, timer: number) {
    const currentYear = format(new Date(), 'yyyy');
    const existingYear = statistics.yearly.find(year => year.date === currentYear);

    if (existingYear) {
        existingYear.totalTime += timer;
    } else {
        if (statistics.yearly.length >= 5) {
            statistics.yearly.shift();
        }
        statistics.yearly.push({ date: currentYear, pomodoros: 0, totalTime: timer });
    }
}

function updateTotalPomodoroTime(timer: number) {
    const statistics: Statistics = stats()
    updateDailyPomodoroTime(statistics, timer)
    updateWeeklyPomodoroTime(statistics, timer)
    updateMonthlyPomodoroTime(statistics, timer)
    updateAnnualPomodoroTime(statistics, timer)
    statistics.totalTime = statistics.totalTime + timer
    localStorage.setItem('pomodoroStats', JSON.stringify(statistics))
}

export { updatePomodoroCount, stats, updateCompletedTasksCount, updateQuickNotesCount, updateTotalPomodoroTime }