"use client"

import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Progress } from "./ui/progress";

import { stats } from "@/functions/statsHandle";
import Achievements from "./achievements";
import FocusTime from "./focus-time";
import { usePomodoro } from "./PomodoroProvider";
import ProductiveTimes from "./productive-times";
import { Separator } from "./ui/separator";
import UserExp from "./user-exp";
import type { Statistics } from "@/types/types";

// Para cada minuto de Pomodoro rodando +1 ponto
// Para cada ciclo finalizado +10 pontos
// Para cada tarefa finalizada +1 ponto

// Streaks
// 1 dia - 1x
// 2 dias - 2x
// 3 dias - 3x
// 4 dias - 4x
// 5 dias - 5x

const xpPerMinute = 3
const xpPerCycle = 25

const usernames = [
    "BolinhoDeNuvem",
    "DocinhoZen",
    "CaféCalminho",
    "EstrelaMansa",
    "LuaSuave",
    "NuvemDoce",
    "BrilhoMacio",
    "BrisaLeve",
    "SolzinhoQuente",
    "NeveSuave",
    "RoxoGentil",
    "PinguinhoFeliz",
    "DoceSereno",
    "MelodiaZen",
    "GotinhaDourada",
    "ManhãClara",
    "BrisaColorida",
    "FolhinhaVerde",
    "RaiosDeSol",
    "SorrisoSuave",
    "ToqueDeLuz",
    "ChuvaDoce",
    "BrilhoFeliz",
    "CaféMacio",
    "ManhãSuave"
]

export default function UserData() {
    const [currentLevel, setCurrentLevel] = useState<number>(1);
    const [currentXp, setCurrentXp] = useState<number>(0);
    const xpToNextLevel = Math.floor(100 * Math.pow(1.2, currentLevel - 1));
    const [isInitialized, setIsInitialized] = useState<boolean>(false)
    const [currentCycle, setCurrentCycle] = useState<number>(0)
    const [profile, setProfile] = useState<{ image: string, name: string }>()

    const { isActive, cycles, isBreak, timeLeft, selectedTimer } = usePomodoro();

    const [statistics, setStatistics] = useState<Statistics>(stats())

    useEffect(() => {
        if (isActive && !isBreak && timeLeft % 60 === 0 && (timeLeft / 60) !== selectedTimer.timer) {
            setStatistics(stats)
            setCurrentXp(prevXp => prevXp + xpPerMinute);
        }

        if (currentCycle !== cycles) {
            setCurrentXp(prevXp => prevXp + xpPerCycle)
            setCurrentCycle(cycles)
        }

        // setStatistics(stats) // na teoria n precisa rodar a cada segundo pq só tem triggers em minutos
    }, [currentCycle, cycles, isActive, isBreak, selectedTimer.timer, timeLeft])

    useEffect(() => {
        if (currentXp >= xpToNextLevel) {
            const diff = currentXp - xpToNextLevel
            setCurrentXp(diff)
            setCurrentLevel(level => level + 1)
        }
    }, [currentXp, xpToNextLevel])

    useEffect(() => {
        if (!isInitialized) return
        const stringfy = JSON.stringify({ currentXp, currentLevel })
        localStorage.setItem('xpAndLevel', stringfy)
    }, [currentXp, currentLevel, isInitialized])

    useEffect(() => {
        const getXpAndLevel = () => {
            const xpAndLevel = localStorage.getItem('xpAndLevel')
            if (!xpAndLevel) {
                setIsInitialized(true)
                return
            }
            const { currentXp, currentLevel } = JSON.parse(xpAndLevel)

            setCurrentLevel(currentLevel)
            setCurrentXp(currentXp)
            setIsInitialized(true)
        }

        const getProfile = () => {
            const profile = localStorage.getItem('profile')
            if (!profile) {
                const randomNumber = Math.floor(Math.random() * 27) + 1;
                const image = `/pfp/profile-${randomNumber}.webp`
                const name = usernames[Math.floor(Math.random() * usernames.length)]

                const profile = { image, name }
                setProfile(profile)

                localStorage.setItem('profile', JSON.stringify(profile))
            } else {
                setProfile(JSON.parse(profile))
            }
        }

        getProfile()
        getXpAndLevel()
    }, [])

    return (
        <Popover>
            <PopoverTrigger className="inline-flex w-32 max-h-9 h-9 gap-3 items-center cursor-pointer border rounded-md px-2 hover:bg-accent group transition-colors relative">
                <Avatar className="size-6 aspect-square rounded-full inline-flex items-center justify-center">
                    <AvatarImage src={profile?.image} alt="Imagem de perfil do usuário" width={24} height={24} />
                    <AvatarFallback>{profile?.name.slice(0, 1)}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col h-full place-items-center">
                    <span className="font-semibold text-">Nível {currentLevel}</span>

                    <Progress value={(currentXp / xpToNextLevel) * 100} max={100} className="h-1" aria-label="Barra de progresso do nível do usuário" />
                </div>
            </PopoverTrigger>

            <PopoverContent className="w-96 p-4 flex flex-col gap-4">
                <UserExp profile={profile} currentLevel={currentLevel} currentXp={currentXp} xpToNextLevel={xpToNextLevel} />

                <Separator />

                <FocusTime statistics={statistics} />

                <Separator />

                <ProductiveTimes statistics={statistics} />

                <Separator />

                <Achievements />
            </PopoverContent>

            {/* <div className="absolute size-3 top-0 right-0 translate-x-1/2 -translate-y-1/2  flex items-center justify-center">
                <span className="text-xs font-semibold">x1</span>
            </div> */}
        </Popover>
    )
}