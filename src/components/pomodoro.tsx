"use client"

import { useEffect, useState } from "react"
import { Clock, Coffee } from "lucide-react"

import { Button } from "@/components/ui/button"
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
    const [currentCycle, setCurrentCycle] = useState<number>(0)
    // const [timeLeft, setTimeLeft] = useState<number>(selectedTimer.timer * 60)
    // const [isBreak, setIsBreak] = useState<boolean>(false)
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0')
    const seconds = String(timeLeft % 60).padStart(2, '0')

    const startTimer = () => {
        playFocusAudio()
        setIsActive(true)
    }

    const pauseTimer = () => {
        setIsActive(false)
    }

    const resetTimer = () => {
        setIsActive(false)
        setIsBreak(false)
        setCycles(0)
        setTimeLeft(selectedTimer.timer * 60)
    }

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined

        if (isActive && timeLeft >= 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === -1) {
            clearInterval(interval)

            if (!isBreak) {
                setCycles(cycles + 1)
                if (cycles + 1 === selectedTimer.cycles) {
                    setIsBreak(true)
                    setTimeLeft(selectedTimer.longBreak * 60)
                } else {
                    setIsBreak(true)
                    setTimeLeft(selectedTimer.break * 60)
                }
                playBreakAudio()
            } else {
                setIsBreak(false)
                if (cycles === selectedTimer.cycles) {
                    setCycles(0)
                }
                setTimeLeft(selectedTimer.timer * 60)
                playFocusAudio()
            }
        }

        return () => clearInterval(interval)
    }, [isActive, timeLeft, isBreak, cycles, selectedTimer, setCycles, setTimeLeft, setIsBreak])

    useEffect(() => {
        setTimeLeft(selectedTimer.timer * 60)
        selectedTime(selectedTimer);
    }, [selectedTime, selectedTimer, setTimeLeft])

    useEffect(() => {
        if (isActive && !isBreak && timeLeft % 60 === 0 && (timeLeft / 60) !== selectedTimer.timer) {
            updateTotalPomodoroTime(1) // ta atualizando a cada minuto, ent adiciona 1 minuto ao total
            const achievement = checkAchievements()
            if (achievement) newAchievement(achievement)
        }

        if (currentCycle === selectedTimer.cycles && !isBreak) {
            updatePomodoroCount()
            const achievement = checkAchievements()
            if (achievement) newAchievement(achievement)
        }

        setCurrentCycle(cycles)
    }, [currentCycle, cycles, isActive, isBreak, selectedTimer.cycles, selectedTimer.timer, timeLeft])

    return (
        <div className="flex justify-center">
            <div className="flex flex-col items-center relative ">
                <Ears className="w-32 xl:w-96 h-fit fill-foreground" />

                <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center">
                        <div className={`h-fit text-[clamp(0.45rem,9vw,12rem)] leading-none font-mono ${rubik.className} flex items-center text-center`}>
                            <span>{minutes}</span>
                            <span>:</span>
                            <span>{seconds}</span>
                        </div>

                        <span className={`text-[clamp(0.45rem,4vw,5rem)] text-muted-foreground font-medium ${baloo.className}`}>{isBreak ? 'Momento de Pausa' : 'Momento de Foco'}</span>
                    </div>

                    <div className={`flex items-center gap-5 text-[clamp(0.45rem,1.5vw,5rem)] text-muted-foreground`}>
                        <span className={`inline-flex items-center gap-1`}>
                            <Clock className="size-[clamp(0.45rem,1.5vw,5rem)]" />
                            Ciclo {cycles} de {selectedTimer.cycles}
                        </span>

                        <span className={`inline-flex items-center gap-1`}>
                            <Coffee className="size-[clamp(0.45rem,1.5vw,5rem)]" />
                            Proxima pausa: {cycles + 1 === selectedTimer.cycles ? `${selectedTimer.longBreak} minutos` : `${selectedTimer.break} minutos`}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {isActive ? (
                        <Button className="text-sm 2xl:text-lg font-medium focus-visible:ring-red-500" onClick={pauseTimer}>Pause</Button>
                    ) : (
                        <Button className="text-sm 2xl:text-lg font-medium focus-visible:ring-red-500" onClick={startTimer}>Start</Button>
                    )}

                    <Button variant={"outline"} className="text-sm 2xl:text-lg font-medium" onClick={resetTimer}>Reset</Button>

                    <Select
                        defaultValue="classic"
                        onValueChange={(value: TimerOptions) => setSelectedTimer(timers[value])}

                    >
                        <SelectTrigger className="text-sm 2xl:text-lg font-medium min-w-[150px]" aria-label="Selecione o tipo do Pomodoro">
                            <SelectValue placeholder={'Pomodoro'} />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="classic" aria-label="Clássico">Clássico</SelectItem>
                            <SelectItem value="short" aria-label="Curto">Curto</SelectItem>
                            <SelectItem value="balanced" aria-label="Balanceado">Balanceado</SelectItem>
                            <SelectItem value="extended" aria-label="Extendido">Extendido</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}