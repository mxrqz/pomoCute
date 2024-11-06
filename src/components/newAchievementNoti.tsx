import { Award } from "lucide-react"
import { toast } from "sonner"
import { playAchievementUnlocked } from "../functions/sounds"

export function newAchievement(achievement: string) {
    toast(
        <div className="inline-flex gap-5 items-center" >
            <Award />

            <div className="flex flex-col">
                <span className="font-semibold text-lg"> Conquista desbloqueada </span>
                <span className="text-sm">{achievement}</span>
            </div>
        </div>
    )

    playAchievementUnlocked()

    return
}