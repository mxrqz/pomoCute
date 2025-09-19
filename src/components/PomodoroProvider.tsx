"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PomodoroContextProps } from "@/types/types";

const classic = {
    timer: 25,
    break: 5,
    cycles: 4,
    longBreak: 30
}

const short = {
    "timer": 15,
    "break": 3,
    "cycles": 5,
    "longBreak": 10
}

// const short = {
//     "timer": .05,
//     "break": .05,
//     "cycles": 2,
//     "longBreak": .05
// }

const extended = {
    "timer": 50,
    "break": 10,
    "cycles": 3,
    "longBreak": 20
}

const balanced = {
    "timer": 30,
    "break": 7,
    "cycles": 4,
    "longBreak": 20
}

const PomodoroContext = createContext<PomodoroContextProps | undefined>(undefined);

export const usePomodoro = () => {
    const context = useContext(PomodoroContext);
    if (!context) {
        throw new Error('usePomodoro must be used within a PomodoroProvider');
    }
    return context;
};

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const [cycles, setCycles] = useState(0);
    const [selectedTimer, setSelectedTimer] = useState<{ timer: number, break: number, cycles: number, longBreak: number }>(classic)
    const [timeLeft, setTimeLeft] = useState<number>(classic.timer * 60)
    const [isBreak, setIsBreak] = useState<boolean>(false)

    // Only sync timeLeft when timer preset actually changes
    useEffect(() => {
        // Reset to new timer duration when timer type changes
        setTimeLeft(selectedTimer.timer * 60);
        setIsBreak(false);
        setCycles(0);
    }, [selectedTimer.timer]); // Only depend on the timer value, not the whole object

    return (
        <PomodoroContext.Provider value={{ isActive, cycles, setIsActive, setCycles, selectedTimer, setSelectedTimer, timeLeft, setTimeLeft, isBreak, setIsBreak}}>
            {children}
        </PomodoroContext.Provider>
    );
};

export { classic, short, extended, balanced }