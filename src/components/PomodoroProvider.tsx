"use client"

import React, { createContext, useContext, useState } from 'react';

interface PomodoroContextProps {
    isActive: boolean;
    cycles: number;
    setIsActive: (isActive: boolean) => void;
    setCycles: (cycles: number) => void;
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

    return (
        <PomodoroContext.Provider value={{ isActive, cycles, setIsActive, setCycles }}>
            {children}
        </PomodoroContext.Provider>
    );
};
