"use client"

import { useEffect, useState } from "react"
import { Rubik_Mono_One, Inter, Baloo_Paaji_2 } from "next/font/google"
import { Clock, Coffee, Volume2, VolumeX } from "lucide-react"

import { Button } from "./ui/button"
import { playBreakAudio, playFocusAudio } from "./sounds"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import Ears from "./ears"
import { Label } from "./ui/label"
import YtIframe from "./ytIframe"
import { Slider } from "./ui/slider"
import { Toggle } from "./ui/toggle"

const rubik = Rubik_Mono_One({
    weight: ['400'],
    subsets: ['latin']
})

const baloo = Baloo_Paaji_2({ subsets: ['latin'] })

const inter = Inter({ subsets: ['latin'] })

interface Pomodoro {
    selectedTime: (selectedTimer: { timer: number; break: number, cycles: number, longBreak: number }) => void;
    type: "Video" | "Playlist",
    link: string,
    play: boolean
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

export default function Pomodoro({ selectedTime, type, link, play }: Pomodoro) {
    const extractYouTubeID = () => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube-nocookie\.com\/(?:v|e(?:mbed)?)\/|(?:watch\?v=))([^&\n]{11})/;
        
        const match = link.match(regex);
        return match ? match[1] : "jfKfPfyJRdk";
    }

    const videoId = extractYouTubeID()

    const [selectedTimer, setSelectedTimer] = useState<{ timer: number, break: number, cycles: number, longBreak: number }>(classic)
    const [timeLeft, setTimeLeft] = useState<number>(selectedTimer.timer * 60)
    const [isActive, setIsActive] = useState<boolean>(false)
    const [isBreak, setIsBreak] = useState<boolean>(false)
    const [cycles, setCycles] = useState<number>(0)
    const [soundMuted, setSoundMuted] = useState<boolean>(false)
    const [volume, setVolume] = useState<number>(33)

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

                    <div className={`flex items-center gap-5 text-lg text-muted-foreground ${inter.className}`}>
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

                <div className="w-full inline-flex items-center justify-between">
                    <div className="inline-flex gap-5 items-center w-full">
                        {/* <div className="inline-flex items-center gap-2">
                            <Switch
                                id="sound-toggle"
                                checked={soundMuted}
                                onCheckedChange={setSoundMuted}
                            />
                            <Label htmlFor="sound-toggle">
                                {soundMuted ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                                <span className="sr-only">Toggle sound</span>
                            </Label>
                        </div> */}

                        <div className="inline-flex items-center gap-2 w-fit">
                            <Label htmlFor="volume-slider" className="flex items-center gap-2">
                                <Toggle className="p-2"
                                    onClick={(e) => e.stopPropagation()}
                                    onPressedChange={setSoundMuted}
                                    aria-label="Toggle Sound"
                                >
                                    {soundMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                </Toggle>
                                <span className="sr-only">Volume slider</span>
                            </Label>

                            <Slider id="volume-slider" className="w-32"
                                onValueChange={(e) => setVolume(e[0])}
                                defaultValue={[33]}
                                max={100}
                                step={1}
                            />
                        </div>
                    </div>

                    <span className="w-fit text-nowrap">Pomodoros Completos: </span>
                </div>

                <YtIframe id={videoId} playlistId={videoId} playlist={type === "Playlist" ? true : false} autoplay={play} className="" isSoundMuted={soundMuted} volume={volume} />

            </div>
        </div>
    )
}