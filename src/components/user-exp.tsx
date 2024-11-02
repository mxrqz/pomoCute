import { useEffect, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { usePomodoro } from "./PomodoroProvider";

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

export default function UserExp() {
    const [currentLevel, setCurrentLevel] = useState<number>(1);
    const [currentXp, setCurrentXp] = useState<number>(0);
    const xpToNextLevel = Math.floor(100 * Math.pow(1.2, currentLevel - 1));
    const [isInitialized, setIsInitialized] = useState<boolean>(false)
    const [currentCycle, setCurrentCycle] = useState<number>(0)
    const [avatarSrc, setAvatarSrc] = useState<string>()

    const { isActive, cycles } = usePomodoro();

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            interval = setInterval(() => {
                setCurrentXp(prevXp => prevXp + xpPerMinute);
            }, 1000 * 60);
        }

        if (currentCycle !== cycles) {
            setCurrentXp(prevXp => prevXp + xpPerCycle)
            setCurrentCycle(cycles)
        }

        return () => {
            clearInterval(interval);
        };
    }, [isActive, cycles, xpToNextLevel, currentCycle]);

    useEffect(() => {
        if (currentXp >= xpToNextLevel) {
            setCurrentXp(0)
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

        const getPFP = () => {
            const avatar = localStorage.getItem('avatar')
            if (!avatar) {
                const randomNumber = Math.floor(Math.random() * 27);
                const image = `./pfp/profile-${randomNumber}.png`
                setAvatarSrc(image)

                localStorage.setItem('avatar', image)
            } else {
                setAvatarSrc(avatar)
            }
        }

        getPFP()
        getXpAndLevel()
    }, [])

    return (
        <Popover>
            <PopoverTrigger className="inline-flex max-h-9 h-9 gap-3 items-center cursor-pointer border rounded-md px-2 hover:bg-accent group transition-colors relative">
                <Avatar className="size-6 aspect-square rounded-full  inline-flex items-center justify-center">
                    <AvatarImage src={avatarSrc} />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <div className="flex flex-col h-full place-items-center">
                    <span className="font-semibold text-">Level {currentLevel}</span>

                    <Progress value={(currentXp / xpToNextLevel) * 100} max={100} className="h-1" />
                </div>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-fit">
                <span>Current Xp: {currentXp} / {xpToNextLevel}</span>
            </PopoverContent>

            {/* <div className="absolute size-3 top-0 right-0 translate-x-1/2 -translate-y-1/2  flex items-center justify-center">
                <span className="text-xs font-semibold">x1</span>
            </div> */}
        </Popover>
    )
}