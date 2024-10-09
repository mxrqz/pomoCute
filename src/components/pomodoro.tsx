"use client"

import { useEffect, useState } from "react"
import { Rubik_Mono_One, Inter, Baloo_Paaji_2 } from "next/font/google"
import { Clock, Coffee } from "lucide-react"

import { Button } from "./ui/button"
import { playBreakAudio, playFocusAudio } from "./sounds"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import Ears from "./ears"

const rubik = Rubik_Mono_One({
    weight: ['400'],
    subsets: ['latin']
})

const baloo = Baloo_Paaji_2({ subsets: ['latin'] })

const inter = Inter({ subsets: ['latin'] })

interface Pomodoro {
    selectedTime: (selectedTimer: { timer: number; break: number, cycles: number, longBreak: number }) => void;
}

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

type TimerOptions = 'classic' | 'short' | 'balanced' | 'extended';

const timers: Record<TimerOptions, { timer: number, break: number, cycles: number, longBreak: number }> = {
    classic: classic,
    short: short,
    balanced: balanced,
    extended: extended
}

export default function Pomodoro({ selectedTime }: Pomodoro) {
    const [selectedTimer, setSelectedTimer] = useState<{ timer: number, break: number, cycles: number, longBreak: number }>(classic)
    const [timeLeft, setTimeLeft] = useState<number>(selectedTimer.timer * 60)
    const [isActive, setIsActive] = useState<boolean>(false)
    const [isBreak, setIsBreak] = useState<boolean>(false)
    const [cycles, setCycles] = useState<number>(0)

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

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            clearInterval(interval)

            if (!isBreak) {
                setCycles(prevCycle => prevCycle + 1)
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
    }, [isActive, timeLeft, isBreak, cycles, selectedTimer])

    useEffect(() => {
        setTimeLeft(selectedTimer.timer * 60)
        selectedTime(selectedTimer);
    }, [selectedTime, selectedTimer])

    return (
        <div className="flex w-full h-full gap-10">
            <div className="flex flex-col gap-5 items-center relative">
                <Ears className="w-96 h-fit fill-foreground" />

                <div className="flex flex-col gap-5 items-center">
                    <div className="flex flex-col items-center">
                        <div className={`text-[12rem] leading-none font-mono ${rubik.className} flex items-center`}>
                            <span>{minutes}</span>
                            <span>:</span>
                            <span>{seconds}</span>
                        </div>

                        <span className={`text-5xl text-muted-foreground font-medium ${baloo.className}`}>{isBreak ? 'Momento de Pausa' : 'Momento de Foco'}</span>
                    </div>

                    <div className={`flex items-center gap-5 text-lg text-muted-foreground ${inter.className} mt-10`}>
                        <span className="inline-flex items-center gap-1">
                            <Clock size={24} />
                            Ciclo {cycles} de {selectedTimer.cycles}
                        </span>

                        <span className="inline-flex items-center gap-1">
                            <Coffee size={24} />
                            Proxima pausa: {cycles + 1 === selectedTimer.cycles ? `${selectedTimer.longBreak} minutos` : `${selectedTimer.break} minutos`}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {isActive ? (
                        <Button className="text-lg font-medium" onClick={pauseTimer}>Pause</Button>
                    ) : (
                        <Button className="text-lg font-medium" onClick={startTimer}>Start</Button>
                    )}

                    <Button variant={"outline"} className="text-lg font-medium" onClick={resetTimer}>Reset</Button>

                    <Select
                        defaultValue="classic"
                        onValueChange={(value: TimerOptions) => setSelectedTimer(timers[value])}
                    >
                        <SelectTrigger className="text-lg font-medium min-w-[150px]">
                            <SelectValue placeholder={'Pomodoro'} />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="classic">Clássico</SelectItem>
                            <SelectItem value="short">Curto</SelectItem>
                            <SelectItem value="balanced">Balanceado</SelectItem>
                            <SelectItem value="extended">Extendido</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}