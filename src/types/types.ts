interface Ears {
    className: string
}

interface PomodoroContextProps {
    isActive: boolean;
    cycles: number;
    setIsActive: (isActive: boolean) => void;
    setCycles: (cycles: number) => void;
    selectedTimer: { timer: number, break: number, cycles: number, longBreak: number };
    setSelectedTimer: (timer: { timer: number, break: number, cycles: number, longBreak: number }) => void;
    timeLeft: number;
    setTimeLeft: (timeLeft: number) => void;
    isBreak: boolean;
    setIsBreak: (isBreak: boolean) => void
}

interface Pomodoro {
    selectedTime: (selectedTimer: { timer: number; break: number, cycles: number, longBreak: number }) => void;
}

interface MonthlyPomodoroData {
    date: string;
    times: string[];
    pomodoros: number;
    totalTime: number;
}

interface PomodoroData {
    date: string;
    pomodoros: number;
    totalTime: number;
}

interface Statistics {
    daily: PomodoroData[];
    weekly: PomodoroData[];
    monthly: MonthlyPomodoroData[];
    yearly: PomodoroData[];
    totalPomodoro: number;
    totalTime: number;
    consecutiveDays: number;
    completedTasksCount: number;
    quickNotes: number;
    musicListeningDuration: number;
}

interface SettingsProps {
    settings: (settings: { mediaType: "Video" | "Playlist", URL: string, autoplay: boolean | undefined, index: number }) => void
}

interface Tasks {
    task: string,
    completed: boolean
}

interface Notes {
    id: string,
    title: string,
    description: string,
    content: string
}

interface Note {
    id?: string;
    title?: string,
    description?: string;
    content?: string;
    notes?: Notes[];
    returnFunction?: (notes: Notes[]) => void;
}

interface Achievements {
    icon: string;
    id: string;
    time: Date;
}

interface UserProfile {
    image: string,
    name: string
}

interface UserExp {
    currentLevel: number,
    currentXp: number
}

interface FocusTime {
    statistics: Statistics
}

interface ProductiveTime {
    statistics: Statistics
}

interface UserComponent {
    profile?: UserProfile,
    currentLevel: number,
    currentXp: number,
    xpToNextLevel: number
}

export type { Pomodoro, Statistics, PomodoroData, Tasks, Achievements, Notes, Note, Ears, PomodoroContextProps, SettingsProps, UserProfile, UserExp, FocusTime, ProductiveTime, UserComponent }