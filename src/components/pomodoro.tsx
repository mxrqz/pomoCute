"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { Clock, Coffee } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MotionWrapper, FadeIn, SlideIn, Pulse, Scale, CountdownAnimation, FloatingNotification } from "@/components/motion-wrapper"
import { playBreakAudio, playFocusAudio } from "../functions/sounds"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Ears from "@/components/ears"
import type { Pomodoro } from "@/types/types"
import { classic, extended, short, balanced, usePomodoro } from "@/components/PomodoroProvider"
import { rubik, baloo } from '@/fonts/fonts'
import { updateTotalPomodoroTime, updatePomodoroCount } from "@/functions/statsHandle"
import { checkAchievements } from "@/functions/achievementsHandle"
import { newAchievement } from "./newAchievementNoti"

type TimerOptions = 'classic' | 'short' | 'balanced' | 'extended';

const timers: Record<TimerOptions, { timer: number, break: number, cycles: number, longBreak: number }> = {
    classic: classic,
    short: short,
    balanced: balanced,
    extended: extended
}

export default function Pomodoro({ selectedTime }: Pomodoro) {
    const { setIsActive, setCycles, cycles, isActive, selectedTimer, setSelectedTimer, timeLeft, setTimeLeft, isBreak, setIsBreak } = usePomodoro();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastMinuteRef = useRef<number>(-1);
    const completionHandledRef = useRef<boolean>(false);
    const [showNotification, setShowNotification] = useState(false);

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0')
    const seconds = String(timeLeft % 60).padStart(2, '0')

    const startTimer = useCallback(() => {
        playFocusAudio()
        setIsActive(true)
    }, [setIsActive])

    const pauseTimer = useCallback(() => {
        setIsActive(false)
    }, [setIsActive])

    const resetTimer = useCallback(() => {
        setIsActive(false)
        setIsBreak(false)
        setCycles(0)
        setTimeLeft(selectedTimer.timer * 60)
        lastMinuteRef.current = -1;
        completionHandledRef.current = false;
    }, [setIsActive, setIsBreak, setCycles, setTimeLeft, selectedTimer.timer])

    // Handle timer completion logic
    const handleTimerCompletion = useCallback(() => {
        if (completionHandledRef.current) return;
        completionHandledRef.current = true;

        setIsActive(false);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);

        if (!isBreak) {
            // Focus session completed
            const newCycles = cycles + 1;
            setCycles(newCycles);

            // Determine next break type and set time
            if (newCycles === selectedTimer.cycles) {
                setTimeLeft(selectedTimer.longBreak * 60);
                setCycles(0); // Reset cycles after long break
            } else {
                setTimeLeft(selectedTimer.break * 60);
            }
            setIsBreak(true);
            playBreakAudio();

            // Update pomodoro count and check achievements
            updatePomodoroCount();
            const achievement = checkAchievements();
            if (achievement) newAchievement(achievement);

        } else {
            // Break completed, start next focus session
            setIsBreak(false);
            setTimeLeft(selectedTimer.timer * 60);
            playFocusAudio();
        }
    }, [isBreak, cycles, selectedTimer, setCycles, setIsBreak, setTimeLeft, setIsActive]);

    // Main timer logic - simplified
    useEffect(() => {
        if (isActive) {
            // Reset completion handler when starting
            completionHandledRef.current = false;

            intervalRef.current = setInterval(() => {
                setTimeLeft((prev: number) => {
                    if (prev <= 1) {
                        // Timer completed
                        handleTimerCompletion();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            // Clear interval when paused
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isActive, handleTimerCompletion, setTimeLeft]);

    // Track focus time for statistics (only during focus sessions)
    useEffect(() => {
        if (isActive && !isBreak) {
            const currentMinute = Math.floor(timeLeft / 60);
            if (lastMinuteRef.current !== currentMinute && lastMinuteRef.current > currentMinute) {
                // A minute has passed during focus
                updateTotalPomodoroTime(1);
                const achievement = checkAchievements();
                if (achievement) newAchievement(achievement);
            }
            lastMinuteRef.current = currentMinute;
        }
    }, [timeLeft, isActive, isBreak]);

    // Update parent component when timer changes
    useEffect(() => {
        selectedTime(selectedTimer);
    }, [selectedTime, selectedTimer])

    return (
        <MotionWrapper className="flex justify-center">
            <div className="flex flex-col items-center relative ">
                <SlideIn direction="down" delay={0.1}>
                    <Ears className="w-16 sm:w-24 md:w-32 lg:w-40 xl:w-96 h-fit fill-current text-primary" />
                </SlideIn>

                <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center">
                        <CountdownAnimation
                            timeLeft={timeLeft}
                            totalTime={selectedTimer.timer * 60}
                            className={`relative h-fit text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl leading-none font-mono ${rubik.className} flex items-center text-center border-2 border-primary rounded-lg p-2 sm:p-3 md:p-4 text-primary`}
                            role="timer"
                            aria-live="polite"
                            aria-label={`Timer: ${minutes} minutos e ${seconds} segundos ${isBreak ? 'de pausa' : 'de foco'}`}
                        >
                            <Pulse isActive={isActive && timeLeft <= 60}>
                                <span aria-hidden="true">{minutes}</span>
                                <span aria-hidden="true">:</span>
                                <span aria-hidden="true">{seconds}</span>
                            </Pulse>
                        </CountdownAnimation>

                        <FadeIn delay={0.3}>
                            <span
                                className={`text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground font-medium ${baloo.className}`}
                                aria-live="polite"
                                role="status"
                            >
                                {isBreak ? 'Momento de Pausa' : 'Momento de Foco'}
                            </span>
                        </FadeIn>
                    </div>

                    <SlideIn direction="up" delay={0.4}>
                        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 md:gap-3 lg:gap-5 text-xs sm:text-sm md:text-base text-muted-foreground">
                            <span className="inline-flex items-center gap-1" aria-label={`Ciclo atual: ${cycles} de ${selectedTimer.cycles}`}>
                                <Clock className="size-3 sm:size-4 md:size-5 lg:size-6 text-muted-foreground" aria-hidden="true" />
                                Ciclo {cycles} de {selectedTimer.cycles}
                            </span>

                            <span
                                className="inline-flex items-center gap-1"
                                aria-label={`Próxima pausa será de ${cycles + 1 === selectedTimer.cycles ? selectedTimer.longBreak : selectedTimer.break} minutos`}
                            >
                                <Coffee className="size-3 sm:size-4 md:size-5 lg:size-6 text-muted-foreground" aria-hidden="true" />
                                Proxima pausa: {cycles + 1 === selectedTimer.cycles ? `${selectedTimer.longBreak} minutos` : `${selectedTimer.break} minutos`}
                            </span>
                        </div>
                    </SlideIn>
                </div>

                <SlideIn direction="up" delay={0.5}>
                    <div id="timer-controls" className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4 md:mt-6 w-full max-w-xs sm:max-w-sm" role="group" aria-label="Controles do timer">
                        {isActive ? (
                            <Scale isPressed={isActive}>
                                <Button
                                    className="text-sm sm:text-base lg:text-lg font-medium focus-visible:ring-red-500 flex-1"
                                    onClick={pauseTimer}
                                    aria-label="Pausar timer"
                                    aria-describedby="timer-status"
                                >
                                    Pause
                                </Button>
                            </Scale>
                        ) : (
                            <Scale>
                                <Button
                                    className="text-sm sm:text-base lg:text-lg font-medium focus-visible:ring-red-500 flex-1"
                                    onClick={startTimer}
                                    aria-label="Iniciar timer"
                                    aria-describedby="timer-status"
                                >
                                    Start
                                </Button>
                            </Scale>
                        )}

                        <Scale>
                            <Button
                                variant={"outline"}
                                className="text-sm sm:text-base lg:text-lg font-medium flex-1"
                                onClick={resetTimer}
                                aria-label="Resetar timer para o tempo inicial"
                            >
                                Reset
                            </Button>
                        </Scale>

                        <Scale>
                            <Select
                                defaultValue="classic"
                                onValueChange={(value: TimerOptions) => setSelectedTimer(timers[value])}
                            >
                                <SelectTrigger className="text-sm sm:text-base lg:text-lg font-medium min-w-[120px] sm:min-w-[150px]" aria-label="Selecione o tipo do Pomodoro">
                                    <SelectValue placeholder={'Pomodoro'} />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="classic" aria-label="Pomodoro Clássico: 25 minutos de foco, 5 de pausa">Clássico</SelectItem>
                                    <SelectItem value="short" aria-label="Pomodoro Curto: 15 minutos de foco, 3 de pausa">Curto</SelectItem>
                                    <SelectItem value="balanced" aria-label="Pomodoro Balanceado: 30 minutos de foco, 7 de pausa">Balanceado</SelectItem>
                                    <SelectItem value="extended" aria-label="Pomodoro Extendido: 50 minutos de foco, 10 de pausa">Extendido</SelectItem>
                                </SelectContent>
                            </Select>
                        </Scale>
                    </div>
                </SlideIn>

                {/* Screen reader announcements */}
                <div id="timer-status" className="sr-only" aria-live="polite" aria-atomic="true">
                    {isActive ? 'Timer em execução' : 'Timer pausado'}
                    {isBreak ? ', momento de pausa' : ', momento de foco'}
                </div>

                {/* Floating notification for timer completion */}
                <FloatingNotification
                    isVisible={showNotification}
                    className="bg-background border-2 border-primary shadow-lg rounded-lg p-4"
                >
                    <div className="flex items-center gap-2">
                        {isBreak ? <Coffee className="w-5 h-5 text-primary" /> : <Clock className="w-5 h-5 text-primary" />}
                        <span className="font-medium text-foreground">
                            {isBreak ? 'Hora da pausa!' : 'Sessão completa!'}
                        </span>
                    </div>
                </FloatingNotification>
            </div>
        </MotionWrapper>
    )
}