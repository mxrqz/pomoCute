import { useEffect, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { usePomodoro } from "./PomodoroProvider";
import { Star, Zap } from "lucide-react";

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

export default function UserExp() {
    const [currentLevel, setCurrentLevel] = useState<number>(1);
    const [currentXp, setCurrentXp] = useState<number>(0);
    const xpToNextLevel = Math.floor(100 * Math.pow(1.2, currentLevel - 1));
    const [isInitialized, setIsInitialized] = useState<boolean>(false)
    const [currentCycle, setCurrentCycle] = useState<number>(0)
    const [profile, setProfile] = useState<{ image: string, name: string }>()

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
    }, [isActive, cycles, currentCycle]);

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

        const getProfile = () => {
            const profile = localStorage.getItem('profile')
            if (!profile) {
                const randomNumber = Math.floor(Math.random() * 27);
                const image = `./pfp/profile-${randomNumber}.png`
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

    // things to add
    // [ ] separator
    // [ ] achievements
    //  - [ ] First Pomodoro
    //  - [ ] pensar em outros achievements

    return (
        <Popover>
            <PopoverTrigger className="inline-flex max-h-9 h-9 gap-3 items-center cursor-pointer border rounded-md px-2 hover:bg-accent group transition-colors relative">
                <Avatar className="size-6 aspect-square rounded-full inline-flex items-center justify-center">
                    <AvatarImage src={profile?.image} />
                    <AvatarFallback>{profile?.name.slice(0, 1)}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col h-full place-items-center">
                    <span className="font-semibold text-">Nível {currentLevel}</span>

                    <Progress value={(currentXp / xpToNextLevel) * 100} max={100} className="h-1" />
                </div>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-4">
                <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={profile?.image} alt={profile?.name} />
                        <AvatarFallback>{profile?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-lg">{profile?.name}</h3>
                        <div className="flex items-center text-muted-foreground">
                            <Star className="w-4 h-4 mr-1" />
                            <span>Nível {currentLevel}</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Progresso de XP</span>
                        <span>{currentXp} / {xpToNextLevel}</span>
                    </div>
                    <Progress value={(currentXp / xpToNextLevel) * 100} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Próximo nível em {xpToNextLevel - currentXp} XP</span>
                        <div className="flex items-center">
                            <Zap className="w-4 h-4 mr-1" />
                            <span>{(currentXp / xpToNextLevel) * 100}%</span>
                        </div>
                    </div>
                </div>
            </PopoverContent>

            {/* <div className="absolute size-3 top-0 right-0 translate-x-1/2 -translate-y-1/2  flex items-center justify-center">
                <span className="text-xs font-semibold">x1</span>
            </div> */}
        </Popover>
    )
}